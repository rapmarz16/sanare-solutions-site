import { handleContact, type FormEnv } from "../_lib/cloudflare-form";

interface PagesContext {
  request: Request;
  env: FormEnv;
}

export const onRequestPost = ({ request, env }: PagesContext) => handleContact(request, env);
