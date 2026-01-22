╔══════════════════════════════════════════════════════════════╗
║  HƯỚNG DẪN NHANH: SSH KHÔNG CẦN MẬT KHẨU TRÊN WINDOWS       ║
╚══════════════════════════════════════════════════════════════╝

📋 ĐÃ HOÀN THÀNH TRÊN SERVER:
   ✓ Public key đã có trong ~/.ssh/authorized_keys
   ✓ Permissions đã đúng
   ✓ Private key sẵn sàng

🖥️  TRÊN MÁY WINDOWS CỦA BẠN:

CÁCH 1: TẠO KEY MỚI TRÊN WINDOWS (KHUYẾN NGHỊ)

1. Mở PowerShell (Windows + X > Windows PowerShell)

2. Chạy script tự động:
   .\setup-ssh-windows.ps1
   
   Hoặc làm thủ công:
   
   # Tạo thư mục .ssh
   mkdir $env:USERPROFILE\.ssh -Force
   
   # Tạo SSH key
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Nhấn Enter để dùng đường dẫn mặc định
   
   # Copy public key lên server
   type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@YOUR_SERVER_IP "cat >> ~/.ssh/authorized_keys"
   
   # Hoặc dùng ssh-copy-id (nếu có)
   ssh-copy-id root@YOUR_SERVER_IP

3. SSH vào server (không cần mật khẩu):
   ssh root@YOUR_SERVER_IP


CÁCH 2: COPY PRIVATE KEY TỪ SERVER VỀ WINDOWS

1. Mở PowerShell trên Windows

2. Chạy script:
   .\copy-key-to-windows.ps1
   
   Hoặc copy thủ công:
   
   # Copy private key từ server về
   scp root@YOUR_SERVER_IP:/root/.ssh/id_ed25519 $env:USERPROFILE\.ssh\id_ed25519_server
   
   # Đặt permissions
   icacls $env:USERPROFILE\.ssh\id_ed25519_server /inheritance:r /grant:r "$env:USERNAME:(R)"

3. SSH vào server:
   ssh -i $env:USERPROFILE\.ssh\id_ed25519_server root@YOUR_SERVER_IP


📁 CÁC FILE ĐÃ TẠO:
   • SSH_SETUP_WINDOWS.md  - Hướng dẫn chi tiết cho Windows
   • setup-ssh-windows.ps1  - Script tự động tạo key mới
   • copy-key-to-windows.ps1 - Script copy key từ server về

📝 LƯU Ý:
   • Thay YOUR_SERVER_IP bằng IP thật của server
   • Nếu dùng Windows 10/11, OpenSSH đã có sẵn
   • Có thể dùng Git Bash thay cho PowerShell nếu đã cài Git

🔍 KIỂM TRA:
   ssh -v root@YOUR_SERVER_IP
   
   Nếu thấy "Authentication succeeded (publickey)" là thành công!

