sudo rm -rf build/ build.gz build_c.gz
sudo npm run build
sudo tar -cvf build_c.gz build/
gsutil cp build_c.gz gs://shenzyn-code/build_c.gz
