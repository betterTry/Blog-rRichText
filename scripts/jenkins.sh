#!/usr/bin/env bash
echo 
echo --- 开始任务【git env】 --- 
echo 'branch: ${GIT_BRANCH}'
echo 'commit: ${$GIT_COMMIT}'
echo 'comment: ${COMMITTER_NAME}'
echo 'author: ${AUTHOR_NAME}'
echo --- 结束任务【env】 env --- 

echo 
echo
echo --- 开始任务【env】 ---
echo $PATH
echo node -v
node -v
echo npm -v
npm -v
echo npm config get registry
npm config get registry
echo --- 结束任务【env】 ---
echo
echo

echo --- 开始安装gulp --- 
echo 
npm cache clean --force
npm install -g gulp --loglevel=error
echo
echo --- gulp 安装完成 --- 
echo

echo --- npm install ---
echo
npm install --loglevel=error

echo
echo ---- 开始build --- 
echo
npm run build
echo
echo ---- 结束build --- 
echo


echo ---- pm2 start app --- 
echo 
pm2 start app