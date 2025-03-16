/** @format */

import SearchBar from "./SearchBar";
import NotificationsDropdown from "./dropdowns/NotificationsDropdown";
import AppsDropdown from "./dropdowns/AppsDropdown";
import UserDropdown from "./dropdowns/UserDropdown";

export default function NavbarRight() {
  return (
    <div className="flex items-center lg:order-2">
      <SearchBar isMobile={true} />
      <NotificationsDropdown />
      <AppsDropdown />
      <UserDropdown />
    </div>
  );
}
