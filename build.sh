#!/bin/bash

curl -s -S -L https://raw.githubusercontent.com/altlimit/sitegen/master/install.sh | bash
~/.altlimit/bin/sitegen -minify
