import { library } from "@fortawesome/fontawesome-svg-core";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";

// Prevent fontawesome from adding its CSS since we did it manually
config.autoAddCss = false;

// Add the imported icons to the library
library.add(faFolder);
