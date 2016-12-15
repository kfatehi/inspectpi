# image mounting
## determine the partition offsets
fdisk -lu images/2016-11-25-raspbian-jessie-lite.img

Disk images/2016-11-25-raspbian-jessie-lite.img: 1.3 GiB, 1390411776 bytes, 2715648 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x244b8248

Device                                      Boot  Start     End Sectors  Size Id Type
images/2016-11-25-raspbian-jessie-lite.img1        8192  137215  129024   63M  c W95 FAT32 (LBA)
images/2016-11-25-raspbian-jessie-lite.img2      137216 2715647 2578432  1.2G 83 Linux

## mount the partitions you want by specifying the offset
sudo mount -t auto -o loop,offset=$((8192*512)) images/2016-11-25-raspbian-jessie-lite.img mnt
sudo mount -t auto -o loop,offset=$((137216*512)) images/2016-11-25-raspbian-jessie-lite.img mnt
