{ ... }:

{
  bootstrap = ''
    # Make all files in the template writeable
    # so we can copy them to the workspace.
    chmod -R +w .

    # Copy all files from the template
    # to the destination directory ($out).
    # The paths are relative to this nix file.
    cp -rf ./* "$out/"
    cp -f ./dev.nix "$out/.idx/dev.nix"
    chmod -R u+w "$out"
  '';
}