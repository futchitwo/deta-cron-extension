# source replit.sh
curl -fsSL https://get.deta.dev/cli.sh | sh &&
export PATH="/home/runner/.deta/bin:$PATH" &&
# wildcard includes dotfile .[^\.]*
shopt -s dotglob