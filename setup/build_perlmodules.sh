#!/bin/bash
## other decision structure
set -o errexit
# don't try to remember where things are
set +o hashall
## do not tollerate unset variables
set -u

if [ x$1 = 'x' ]; then
   echo "Missing destination directory."
   exit 1
fi

export LD_LIBRARY_PATH=

export PREFIX=$1

. `dirname $0`/module_builder.inc

perlmodule Mojolicious
perlmodule MojoX::Dispatcher::Qooxdoo::Jsonrpc
perlmodule Config::Grammar
