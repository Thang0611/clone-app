#!/bin/bash
# PM2 Quick Commands Script
# Simplify PM2 start/restart/stop commands

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to show usage
show_usage() {
    echo "Usage: ./pm2.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start PM2 process"
    echo "  restart   - Restart PM2 process (--update-env)"
    echo "  stop      - Stop PM2 process"
    echo "  status    - Show PM2 status"
    echo "  logs      - Show PM2 logs (with tail -f)"
    echo "  logs-tail - Show last 50 lines of logs"
    echo "  save      - Save PM2 process list"
    echo "  delete    - Delete PM2 process"
    echo "  setup     - Setup PM2 auto-start on boot"
    echo ""
}

# Start
if [ "$1" == "start" ]; then
    echo -e "${GREEN}Starting PM2...${NC}"
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}✓ Started and saved!${NC}"

# Restart
elif [ "$1" == "restart" ]; then
    echo -e "${YELLOW}Restarting PM2...${NC}"
    pm2 restart getcourses-frontend --update-env
    echo -e "${GREEN}✓ Restarted!${NC}"

# Stop
elif [ "$1" == "stop" ]; then
    echo -e "${YELLOW}Stopping PM2...${NC}"
    pm2 stop getcourses-frontend
    echo -e "${GREEN}✓ Stopped!${NC}"

# Status
elif [ "$1" == "status" ]; then
    pm2 list

# Logs (tail -f)
elif [ "$1" == "logs" ]; then
    echo -e "${GREEN}Showing PM2 logs (Ctrl+C to exit)...${NC}"
    pm2 logs getcourses-frontend

# Logs tail (last 50 lines)
elif [ "$1" == "logs-tail" ]; then
    pm2 logs getcourses-frontend --lines 50 --nostream

# Save
elif [ "$1" == "save" ]; then
    echo -e "${GREEN}Saving PM2 process list...${NC}"
    pm2 save
    echo -e "${GREEN}✓ Saved!${NC}"

# Delete
elif [ "$1" == "delete" ]; then
    echo -e "${RED}Deleting PM2 process...${NC}"
    pm2 delete getcourses-frontend
    echo -e "${YELLOW}✓ Deleted!${NC}"

# Setup auto-start
elif [ "$1" == "setup" ]; then
    echo -e "${GREEN}Setting up PM2 auto-start on boot...${NC}"
    echo ""
    
    # Save current process list
    pm2 save
    
    # Generate startup script
    STARTUP_CMD=$(pm2 startup systemd -u root --hp /root | grep -E "^sudo")
    
    if [ -n "$STARTUP_CMD" ]; then
        echo -e "${YELLOW}Run this command as root:${NC}"
        echo "$STARTUP_CMD"
        echo ""
        echo -e "${GREEN}Or copy and paste the command above${NC}"
    else
        echo -e "${GREEN}✓ PM2 startup already configured!${NC}"
        echo ""
        echo "Check status:"
        systemctl status pm2-root.service --no-pager | head -10
    fi

# Invalid command
else
    show_usage
    exit 1
fi
