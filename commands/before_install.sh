sudo mv build_c.gz build_c.gz.old

sudo aws s3 cp s3://shenzyn-code/frontend/build_c_stage.gz build_c.gz

sudo tar -xvf build_c.gz

sudo rm -rf /var/www/company/html/*