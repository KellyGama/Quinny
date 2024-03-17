from node 
workdir /app 
copy ..
expose 3000
run npm i 
cmd ["node", "server.js"]