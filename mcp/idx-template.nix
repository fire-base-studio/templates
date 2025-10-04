{ pkgs, mcp_template ? "oauth-provider", ... }:
{
  bootstrap = pkgs.writeShellScriptBin "bootstrap" ''
    set -euo pipefail
    echo "--- Bootstrapping MCP Template ---"
    echo "Selected template: ${mcp_template}"
    
    # Define the source directory
    SOURCE_DIR="./${mcp_template}"

    # Check if the source directory exists
    if [ ! -d "$SOURCE_DIR" ]; then
      echo "Error: Template directory '$SOURCE_DIR' not found!" >&2
      exit 1
    fi

    echo "Copying files from $SOURCE_DIR to the workspace root"
    
    # Copy all contents (including dotfiles) from the subdirectory to the output
    cp -a "$SOURCE_DIR/." "$out"
    
    # The files might be read-only, ensure they are writable for the user
    chmod -R u+w "$out"
    
    echo "--- Bootstrap complete ---"
  '';
}
