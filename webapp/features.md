this is a wishlist... not in any order really

sd card prep
- [x] download/cache/show images (raspbian)
- [ ] be able to burn from this selection
- [ ] visually inspect current SD
- [ ] inspect SD's boot partition
- [ ] show device overlay and cmdline configuration
- [ ] make this human-readable and alterable

image manip/explore
- [ ] use something like losetup to browse the image https://linux.die.net/man/8/losetup
- [ ] be able to create a mutable copy of an image, change it with losetup, and then freeze it

wireless related
- [x] check wlan1 state
- [x] reconfigure wlan1

be able to configure the wifi of some other pi in all possible ways:
- [ ] mount root partition of target's sd card and write to wpa_supplicant
- [ ] pre-config target's sd card to connect console to UART pins
- [ ] use the pi-zero as an ethernet/USB nic

once on the target's network using the pi zero bridge, be able to
- [ ] scan wifi network from perspective of target
- [ ] configure wifi on the target
