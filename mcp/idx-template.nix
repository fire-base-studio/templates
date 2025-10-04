{ pkgs, mcp_template ? "oauth-provider", ... }:
{
  bootstrap = ''
    set -euo pipefail
    echo "--- Bootstrapping MCP Template ---"
    echo "Selected template: ${mcp_template}"
    
    # Define the source directory using Nix path interpolation to get the correct absolute path.
    SOURCE_DIR="${./.}/${mcp_template}"

    # Check if the source directory exists
    if [ ! -d "$SOURCE_DIR" ]; then
      echo "Error: Template directory '$SOURCE_DIR' not found!" >&2
      exit 1
    fi

    echo "Copying files from $SOURCE_DIR to the workspace root..."
    
    # Copy all contents (including dotfiles) from the subdirectory to the output directory ($out)
    cp -a "$SOURCE_DIR/." "$out"
    
    # The files in nix store are read-only, so we need to make them writable for the user.
    chmod -R u+w "$out"
    
    echo "--- Bootstrap complete ---"
  '';
}
