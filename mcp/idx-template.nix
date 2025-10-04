{ pkgs, params, ... }: {
  bootstrap = pkgs.writeShellScriptBin "bootstrap" ''
    set -euo pipefail
    echo "--- Bootstrapping MCP Template ---"
    echo "Selected template: ${params.mcp_template}"
    echo "Copying files from ./${params.mcp_template}/ to $out"
    
    # Copy all contents (including dotfiles) from the subdirectory to the output
    cp -a "./${params.mcp_template}/." "$out"
    
    # The files might be read-only, ensure they are writable for the user
    chmod -R u+w "$out"
    
    echo "--- Bootstrap complete ---"
  '';
}
