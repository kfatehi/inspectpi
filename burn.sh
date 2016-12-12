#!/bin/bash
if [[ -z $BURN_TARGET ]]; then
  diskutil list
  echo ">> please define $BURN_TARGET with one of those disks <<"
  exit 1
else
  diskutil unmountDisk $BURN_TARGET && sudo dd if=Documents/2016-09-23-raspbian-jessie-lite.img of="$BURN_TARGET" bs=8m
fi
