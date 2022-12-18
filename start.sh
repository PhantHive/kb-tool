# get current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# start API
cd $DIR/API
sh start_api.sh
# start app
cd $DIR/app
sh start_app.sh





