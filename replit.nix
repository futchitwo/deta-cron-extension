{ pkgs }: {
	deps = [
		pkgs.nodejs-16_x
    pkgs.unzip
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.yarn
    #pkgs.replitPackages.jest
	];
}