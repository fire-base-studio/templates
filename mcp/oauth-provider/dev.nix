{ pkgs, ... }:

{ pkgs, ... }:

{ pkgs, ... }:

{
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable"

  # Use https://search.nixos.org/packages to find packages.
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace.
  env = {};

  # Defines shell aliases.
  # startup = {
  #   # This will run silently at startup
  #   name = "background_task";
  #   command = "echo 'I am a background task!'";
  # };

  # Run tasks when the workspace starts. 
  startup = {
    install = {
      name = "Install Dependencies";
      command = "npm install";
    };
    start = {
      name = "Start Server";
      command = "npm run start";
    };
  };

  # Defines the services that should be started in the workspace and optional
  # previews for them.
  services = {
    # name = {
    #   start = "..."
    #   preview = {
    #     port = ...
    #     # ...
    #   }
    # }
  };

  # IDX specific settings
  idx = {
    # Enables extensions that are not installed from the marketplace.
    # extensions = [ 
    #   "ms-python.python"
    # ];
    workspace = {
      # Pre-opens files on workspace startup.
      # onStart = {
      #   # Open a file
      #   open = "README.md"
      #   # Open a file and go to a specific line
      #   # open = "src/main.rs:2"
      #   # Open a file in a split view
      #   # split = "src/main.rs:2"
      # }
    };
    previews = {
      # Enables pre-configured previews
      # enable = true;
      # preDefined = [
      #   {
      #     id = "web"
      #     name = "Web Preview"
      #     port = 3000
      #     # ...
      #   }
      # ];
    };
  };
}