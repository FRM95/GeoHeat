set -e
mongosh <<EOF
use admin
db.createUser({
  user: 'root',
  pwd:  '1h4v3cr34t3d4r00t9s3r',
  roles: [{
    role: 'userAdminAnyDatabase'
  }]
})
EOF