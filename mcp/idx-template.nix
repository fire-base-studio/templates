{ pkgs, mcp_template ? "oauth-provider", ... }:
{
  # This is the bootstrap script that will be executed when the workspace is created.
  # It copies the selected template files into the root of the new workspace.
  bootstrap = ''
    set -euo pipefail
    echo "--- Bootstrapping MCP Template ---"
    echo "Selected template: ${mcp_template}"
    
    # Define the source directory relative to the template root
    SOURCE_DIR="./${mcp_template}"

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
