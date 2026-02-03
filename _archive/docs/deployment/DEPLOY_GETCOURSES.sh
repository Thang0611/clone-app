#!/bin/bash

##############################################################################
# Complete Deployment Script for GetCourses.net
# This script sets up PM2 and Nginx for production deployment
# Author: DevOps Team
# Usage: sudo bash DEPLOY_GETCOURSES.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_step "GetCourses.net Deployment Script"
print_status "Starting deployment process..."

# ============================================================================
# STEP 1: Check Prerequisites
# ============================================================================
print_step "STEP 1: Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js first."
    exit 1
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 found: v$PM2_VERSION"
else
    print_warning "PM2 not found. Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
fi

# Check Nginx
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | awk -F/ '{print $2}')
    print_success "Nginx found: $NGINX_VERSION"
else
    print_warning "Nginx not found. Installing Nginx..."
    apt-get update
    apt-get install -y nginx
    print_success "Nginx installed"
fi

# Check Certbot (for SSL)
if command -v certbot &> /dev/null; then
    print_success "Certbot found"
else
    print_warning "Certbot not found. Install for SSL: apt-get install certbot python3-certbot-nginx"
fi

# ============================================================================
# STEP 2: Setup Environment Variables
# ============================================================================
print_step "STEP 2: Setting up Environment Variables"

ENV_FILE="/root/project/clone-app/.env.production"

if [ ! -f "$ENV_FILE" ]; then
    print_warning ".env.production not found. Creating template..."
    cat > "$ENV_FILE" << 'EOF'
# Production Environment Configuration for GetCourses.net
NODE_ENV=production

# Frontend URL
NEXTAUTH_URL=https://getcourses.net
NEXT_PUBLIC_SITE_URL=https://getcourses.net

# Backend API URLs
NEXT_PUBLIC_API_URL=https://api.getcourses.net
NEXT_PUBLIC_SOCKET_URL=https://api.getcourses.net

# Authentication (Generate strong secrets)
NEXTAUTH_SECRET=CHANGE_ME_GENERATE_STRONG_SECRET_MIN_32_CHARS
ADMIN_EMAIL=support@getcourses.net
ADMIN_PASSWORD_HASH=CHANGE_ME_GENERATE_BCRYPT_HASH
EOF
    chmod 600 "$ENV_FILE"
    print_warning "Created $ENV_FILE - Please edit with your actual values!"
    print_warning "Run: openssl rand -base64 32 (to generate NEXTAUTH_SECRET)"
else
    print_success ".env.production exists"
fi

# ============================================================================
# STEP 3: Install Dependencies and Build
# ============================================================================
print_step "STEP 3: Building Application"

cd /root/project/clone-app

if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm ci --production=false
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

print_status "Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# ============================================================================
# STEP 4: Setup PM2
# ============================================================================
print_step "STEP 4: Setting up PM2"

# Stop old process if exists
if pm2 list | grep -q "getcourses-frontend\|getcourses-frontend"; then
    print_status "Stopping old PM2 processes..."
    pm2 delete getcourses-frontend 2>/dev/null || true
    pm2 delete getcourses-frontend 2>/dev/null || true
fi

# Start with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
STARTUP_CMD=$(pm2 startup systemd -u root --hp /root | grep -E "^sudo" || true)
if [ -n "$STARTUP_CMD" ]; then
    print_warning "Run this command to enable PM2 on boot:"
    echo "$STARTUP_CMD"
fi

print_success "PM2 setup completed"

# ============================================================================
# STEP 5: Setup Nginx
# ============================================================================
print_step "STEP 5: Setting up Nginx"

NGINX_CONFIG_SOURCE="/root/project/server/nginx-getcourses.conf"
NGINX_CONFIG_TARGET="/etc/nginx/sites-available/getcourses.net"

# Backup existing config
if [ -f "$NGINX_CONFIG_TARGET" ]; then
    BACKUP_FILE="${NGINX_CONFIG_TARGET}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$NGINX_CONFIG_TARGET" "$BACKUP_FILE"
    print_success "Backed up existing config to $BACKUP_FILE"
fi

# Copy new config
if [ -f "$NGINX_CONFIG_SOURCE" ]; then
    cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG_TARGET"
    print_success "Nginx configuration copied"
else
    print_error "Nginx config file not found: $NGINX_CONFIG_SOURCE"
    exit 1
fi

# Remove default site
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    print_status "Removed default site"
fi

# Create symbolic link
if [ ! -L /etc/nginx/sites-enabled/getcourses.net ]; then
    ln -s /etc/nginx/sites-available/getcourses.net /etc/nginx/sites-enabled/
    print_success "Created symbolic link"
else
    print_warning "Symbolic link already exists"
fi

# Test Nginx configuration
print_status "Testing Nginx configuration..."
if nginx -t; then
    print_success "Nginx configuration test passed!"
else
    print_error "Nginx configuration test failed!"
    exit 1
fi

# Reload Nginx
print_status "Reloading Nginx..."
systemctl reload nginx || systemctl restart nginx
print_success "Nginx reloaded"

# ============================================================================
# STEP 6: Setup SSL (Optional)
# ============================================================================
print_step "STEP 6: SSL Certificate Setup (Optional)"

if command -v certbot &> /dev/null; then
    print_status "Certbot is available. To setup SSL certificates, run:"
    echo ""
    echo "  certbot --nginx -d getcourses.net -d www.getcourses.net"
    echo "  certbot --nginx -d api.getcourses.net"
    echo ""
    read -p "Do you want to setup SSL now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        certbot --nginx -d getcourses.net -d www.getcourses.net
        certbot --nginx -d api.getcourses.net
        print_success "SSL certificates installed"
    else
        print_warning "Skipping SSL setup. Run certbot manually later."
    fi
else
    print_warning "Certbot not installed. Install with: apt-get install certbot python3-certbot-nginx"
fi

# ============================================================================
# STEP 7: Verification
# ============================================================================
print_step "STEP 7: Verification"

# Check PM2 status
print_status "PM2 Status:"
pm2 list | grep getcourses-frontend || print_error "Frontend not running!"

# Check Nginx status
print_status "Nginx Status:"
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check ports
print_status "Checking ports..."
if netstat -tuln | grep -q ":4000"; then
    print_success "Port 4000 (Frontend) is listening"
else
    print_warning "Port 4000 (Frontend) is not listening"
fi

if netstat -tuln | grep -q ":3000"; then
    print_success "Port 3000 (Backend) is listening"
else
    print_warning "Port 3000 (Backend) is not listening"
fi

# ============================================================================
# SUMMARY
# ============================================================================
print_step "Deployment Summary"

echo ""
print_success "========================================="
print_success "Deployment Completed Successfully!"
print_success "========================================="
echo ""

print_status "Application URLs:"
echo "  • Frontend: https://getcourses.net"
echo "  • Backend API: https://api.getcourses.net"
echo ""

print_status "PM2 Commands:"
echo "  • Status: pm2 status"
echo "  • Logs: pm2 logs getcourses-frontend"
echo "  • Restart: pm2 restart getcourses-frontend --update-env"
echo "  • Stop: pm2 stop getcourses-frontend"
echo ""

print_status "Nginx Commands:"
echo "  • Test config: nginx -t"
echo "  • Reload: systemctl reload nginx"
echo "  • Status: systemctl status nginx"
echo "  • Logs: tail -f /var/log/nginx/getcourses.net.access.log"
echo ""

print_status "Next Steps:"
echo "  1. Update .env.production with actual secrets"
echo "  2. Setup SSL certificates (if not done): certbot --nginx -d getcourses.net -d api.getcourses.net"
echo "  3. Verify DNS records point to this server"
echo "  4. Test the application: curl https://getcourses.net"
echo "  5. Monitor logs: pm2 logs getcourses-frontend"
echo ""

print_success "Happy deploying! 🚀"
