# 🔧 Production Configuration Files

Since `.env` files are gitignored, you need to create them manually on the server.

## Create Environment Files

### 1. Production Environment (.env.production)

```bash
cat > /root/clone-app/.env.production << 'EOF'
# Production Environment Configuration
# Frontend: khoahocgiare.info
# Backend API: api.khoahocgiare.info

# Socket.io Server URL for real-time WebSocket updates
NEXT_PUBLIC_SOCKET_URL=https://api.khoahocgiare.info

# API Base URL
NEXT_PUBLIC_API_URL=https://api.khoahocgiare.info
EOF
```

### 2. Local Development Environment (.env.local)

```bash
cat > /root/clone-app/.env.local << 'EOF'
# Local Development Environment Configuration
# Use this for local testing

# Socket.io Server URL for real-time WebSocket updates
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
```

### 3. Verify Files Created

```bash
ls -la /root/clone-app/.env*
cat /root/clone-app/.env.production
```

---

## Quick Setup Script

Run this on your server:

```bash
#!/bin/bash
cd /root/clone-app

# Create production environment file
cat > .env.production << 'EOF'
NEXT_PUBLIC_SOCKET_URL=https://api.khoahocgiare.info
NEXT_PUBLIC_API_URL=https://api.khoahocgiare.info
EOF

# Create local development environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Set proper permissions
chmod 600 .env.production .env.local

echo "✅ Environment files created successfully!"
ls -la .env*
```

Save as `setup-env.sh` and run:
```bash
chmod +x setup-env.sh
./setup-env.sh
```
