#!/bin/bash

cd /opt/buildhome
wget https://github.com/altlimit/sitegen/releases/download/v0.0.7/linux.zip
unzip linux.zip
cd /opt/repo

/opt/buildhome/sitegen -minify
