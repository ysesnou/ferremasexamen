const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

try {
  console.log("⚙️ Generando certificado autofirmado...");
  const script = `
  powershell -Command "& {
    New-SelfSignedCertificate -DnsName localhost -CertStoreLocation Cert:\\LocalMachine\\My -NotAfter (Get-Date).AddYears(1) | 
    Export-PfxCertificate -FilePath '${certDir}\\cert.pfx' -Password (ConvertTo-SecureString -String '1234' -Force -AsPlainText)
  }"
  `;
  execSync(script, { stdio: 'inherit' });
  console.log("✅ Certificado generado como certs/cert.pfx");
} catch (error) {
  console.error("❌ Error al generar certificado:", error.message);
}
