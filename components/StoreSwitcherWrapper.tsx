import { auth } from "@/lib/auth";
import { getUserStores } from "@/server/db/stores";
import { StoreSwitcher } from "./sidebar/store-switcher";

const StoreSwitcherWrapper = async () => {
  const session = await auth();
  const stores = await getUserStores(session?.user.id!);

  return <StoreSwitcher userStores={stores} />;
};

export default StoreSwitcherWrapper;
