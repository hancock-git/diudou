#!/usr/bin/env bash

set -Eeuo pipefail

SOURCE_DIR="${DIUDOU_SOURCE_DIR:-/root/www/diudou}"
DEPLOY_DIR="${DIUDOU_DEPLOY_DIR:-/root/www/aliyun/dd}"
BACKUP_ROOT="${DIUDOU_BACKUP_ROOT:-/root/deploy-backups/diudou}"
HEALTH_TIMEOUT="${DIUDOU_HEALTH_TIMEOUT:-120}"
REPOSITORY_URL="${DIUDOU_REPOSITORY_URL:-https://github.com/hancock-git/diudou.git}"

COMPOSE_FILE="docker-compose.deploy.yml"
RUNTIME_FILE="runtime.tar.gz"
CONTAINER_NAME="ai-website-cloner"
HEALTH_PATH="/agent/ecommerce/home"
LOGIN_PATH="/login"
LOCK_FILE="/var/lock/diudou-deploy.lock"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  log "错误：$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "缺少命令：$1"
}

compose() {
  (
    cd "$DEPLOY_DIR"
    docker compose -f "$COMPOSE_FILE" "$@"
  )
}

container_state() {
  docker inspect "$CONTAINER_NAME" \
    --format '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' \
    2>/dev/null || true
}

wait_until_healthy() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT))
  local state=""

  while ((SECONDS < deadline)); do
    state="$(container_state)"
    if [[ "$state" == "running healthy" ]]; then
      return 0
    fi
    if [[ "$state" == exited* || "$state" == dead* ]]; then
      log "容器异常退出：$state" >&2
      return 1
    fi
    sleep 5
  done

  log "等待容器健康超时，当前状态：${state:-unknown}" >&2
  return 1
}

verify_http() {
  local path

  for path in "$HEALTH_PATH" "$LOGIN_PATH"; do
    if ! curl --fail --silent --show-error --max-time 10 \
      "http://127.0.0.1:3000${path}" >/dev/null; then
      log "页面验证失败：http://127.0.0.1:3000${path}" >&2
      return 1
    fi
    log "页面验证通过：http://127.0.0.1:3000${path}"
  done
}

rollback() {
  local backup_dir="$1"

  log "部署失败，开始回滚：$backup_dir"
  cp -p "$backup_dir/$RUNTIME_FILE" "$DEPLOY_DIR/$RUNTIME_FILE"
  cp -p "$backup_dir/$COMPOSE_FILE" "$DEPLOY_DIR/$COMPOSE_FILE"

  if compose up -d --build; then
    log "旧版本已恢复"
  else
    log "自动回滚失败，请检查：docker compose -f $DEPLOY_DIR/$COMPOSE_FILE logs" >&2
  fi
}

main() {
  local timestamp
  local backup_dir
  local source_commit
  local runtime_hash

  [[ "$(id -u)" -eq 0 ]] || fail "请使用 root 用户执行"
  [[ "$HEALTH_TIMEOUT" =~ ^[1-9][0-9]*$ ]] || fail "DIUDOU_HEALTH_TIMEOUT 必须是正整数"

  require_command git
  require_command docker
  require_command curl
  require_command sha256sum
  require_command flock

  exec 9>"$LOCK_FILE"
  flock -n 9 || fail "已有部署任务正在运行"

  if [[ -d "$SOURCE_DIR/.git" ]]; then
    if [[ -n "$(git -C "$SOURCE_DIR" status --porcelain)" ]]; then
      fail "源码目录存在未提交改动：$SOURCE_DIR"
    fi
    log "拉取 GitHub 最新代码"
    git -C "$SOURCE_DIR" pull --ff-only
  elif [[ -e "$SOURCE_DIR" ]]; then
    fail "源码路径存在但不是 Git 仓库：$SOURCE_DIR"
  else
    log "首次克隆源码：$REPOSITORY_URL"
    git clone --depth 1 --branch main "$REPOSITORY_URL" "$SOURCE_DIR"
  fi

  [[ -f "$SOURCE_DIR/$RUNTIME_FILE" ]] || fail "缺少打包文件：$SOURCE_DIR/$RUNTIME_FILE"
  [[ -f "$SOURCE_DIR/$COMPOSE_FILE" ]] || fail "缺少部署配置：$SOURCE_DIR/$COMPOSE_FILE"
  [[ -d "$DEPLOY_DIR" ]] || fail "部署目录不存在：$DEPLOY_DIR"
  [[ -f "$DEPLOY_DIR/$RUNTIME_FILE" ]] || fail "部署目录缺少旧打包文件，无法创建回滚备份"
  [[ -f "$DEPLOY_DIR/$COMPOSE_FILE" ]] || fail "部署目录缺少旧 Compose 配置，无法创建回滚备份"

  docker compose -f "$SOURCE_DIR/$COMPOSE_FILE" config >/dev/null

  source_commit="$(git -C "$SOURCE_DIR" rev-parse --short HEAD)"
  runtime_hash="$(sha256sum "$SOURCE_DIR/$RUNTIME_FILE" | awk '{print $1}')"
  timestamp="$(date '+%Y%m%d-%H%M%S')"
  backup_dir="$BACKUP_ROOT/$timestamp"

  log "创建回滚备份：$backup_dir"
  mkdir -p "$backup_dir"
  cp -p "$DEPLOY_DIR/$RUNTIME_FILE" "$backup_dir/$RUNTIME_FILE"
  cp -p "$DEPLOY_DIR/$COMPOSE_FILE" "$backup_dir/$COMPOSE_FILE"

  log "更新部署文件，提交：$source_commit，产物 SHA-256：$runtime_hash"
  install -m 0644 "$SOURCE_DIR/$RUNTIME_FILE" "$DEPLOY_DIR/$RUNTIME_FILE"
  install -m 0644 "$SOURCE_DIR/$COMPOSE_FILE" "$DEPLOY_DIR/$COMPOSE_FILE"

  log "重建并启动容器"
  if ! compose up -d --build; then
    rollback "$backup_dir"
    return 1
  fi

  log "等待容器健康检查"
  if ! wait_until_healthy || ! verify_http; then
    docker inspect "$CONTAINER_NAME" \
      --format '{{range .State.Health.Log}}{{.End}} exit={{.ExitCode}} {{printf "%q" .Output}}{{println}}{{end}}' \
      >&2 || true
    docker logs --tail 100 "$CONTAINER_NAME" >&2 || true
    rollback "$backup_dir"
    return 1
  fi

  log "部署完成：commit=$source_commit container=$CONTAINER_NAME state=$(container_state)"
  docker ps --filter "name=$CONTAINER_NAME" \
    --format '容器={{.Names}} 镜像={{.Image}} 端口={{.Ports}} 状态={{.Status}}'
}

main "$@"
