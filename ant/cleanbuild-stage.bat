rmdir /S build
del -f build.gz build_p.gz
move .env.production .env.production.tmp
copy .env.stage .env.production
npm run build