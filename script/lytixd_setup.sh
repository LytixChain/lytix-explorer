#!/bin/bash
# Download latest node and install.
lytixlink=`curl -s https://api.github.com/repos/lytixchain/lytix/releases/latest | grep browser_download_url | grep linux64 | cut -d '"' -f 4`
mkdir -p /tmp/lytix
cd /tmp/lytix
curl -Lo lytix.tar.gz $lytixlink
tar -xzf lytix.tar.gz
sudo mv ./* /usr/local
cd
rm -rf /tmp/lytix
mkdir ~/.lytix

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat >~/.lytix/lytix.conf <<EOL
rpcuser=$rpcuser
rpcpassword=$rpcpassword
daemon=1
txindex=1
EOL

# Start node.
lytixd
