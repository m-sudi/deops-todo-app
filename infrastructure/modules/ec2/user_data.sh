
#!/bin/bash
yum update -y
yum install -y docker

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/todoapp
cd /opt/todoapp

# Create a simple health check endpoint for now
cat > server.js << 'EOF'
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', environment: '${environment}' }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Todo App - ${environment}</h1><p>Application is running!</p>');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOF

# Start the application
nohup node server.js > /var/log/todoapp.log 2>&1 &

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/todoapp.log",
            "log_group_name": "/aws/ec2/${environment}-todo-app",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

