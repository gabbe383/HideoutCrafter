#!/bin/bash -xe
apt-get -y install nginx
apt-get -y install unzip

cd /var/www/html/
rm -rf *
mkdir gamerBlog
mkdir theGamer

cd theGamer
wget https://repl.it/@ChristianAberg/gamer.zip
unzip gamer.zip
rm -rf gamer.zip

cd ../gamerBlog
wget https://repl.it/@ChristianAberg/gamertechblog.zip
unzip gamertechblog.zip
rm -rf gamertechblog.zip

cd /etc/nginx/sites-enabled
config='
server {
      listen 80;

      server_name techblog.thegamer.fake;

      root /var/www/html/gamerBlog;
      index index.html;

      location / {
              try_files $uri $uri/ =404;
      }
}
server {
      listen 80 default_server;

      server_name www.thegamer.fake *.thegamer.fake;

      root /var/www/html/theGamer;
      index index.html;

      location / {
              try_files $uri $uri/ =404;
      }
}
'
echo $config > default

systemctl restart nginx