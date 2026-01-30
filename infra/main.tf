resource "digitalocean_droplet" "app" {
  name   = "devops-pr"
  region = "blr1"
  size   = "s-1vcpu-1gb"
  image  = "ubuntu-22-04-x64"

  ssh_keys = [var.ssh_key_id]

  tags = ["production"]
}
