{ ... }: {
  packages = []; # No special packages needed for bootstrap

  bootstrap = ''
    # Copy the template files to the destination directory ($out)
    # The paths are relative to this nix file.
    cp -rf ${./.gitignore} "$out/.gitignore"
    cp -rf ${./.idx} "$out/.idx"
    cp -rf ${./LICENSE} "$out/LICENSE"
    cp -rf ${./README.md} "$out/README.md"
    cp -rf ${./package.json} "$out/package.json"
    cp -rf ${./src} "$out/src"
    cp -rf ${./idx-template.json} "$out/idx-template.json"

    # Ensure all files are writable by the user
    chmod -R u+w "$out"
  '';
}
