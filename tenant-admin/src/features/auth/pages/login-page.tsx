import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../api/hooks";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useAuthStore } from "@/shared/store/auth-store";
import { LanguageSwitch } from "@/shared/ui/language-switch";
import { Snowfall } from "@/shared/ui/snowfall";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const tenant = useAuthStore((state) => state.tenant);
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token && tenant?.status === "active") {
      const redirectTo =
        (location.state as { from?: string } | undefined)?.from ?? "/";
      navigate(redirectTo, { replace: true });
    }
  }, [tenant?.status, token, navigate, location.state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Snowfall density={80} />
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-2xl">{t("pages.login.title")}</CardTitle>
            <CardDescription>{t("pages.login.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("form.email")}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tenant.com"
                  className={
                    loginMutation.isError
                      ? "ring-2 ring-destructive/60"
                      : undefined
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("form.password")}
                </label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={
                    loginMutation.isError
                      ? "ring-2 ring-destructive/60"
                      : undefined
                  }
                  required
                />
              </div>
              {loginMutation.isError ? (
                <p className="text-sm text-destructive">
                  {loginMutation.error?.message ?? t("auth.errors.generic")}
                </p>
              ) : null}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? t("auth.status.signingIn")
                  : t("pages.login.submit")}
              </Button>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <LanguageSwitch />
                <a className="hover:underline" href="/support">
                  {t("support.needHelp")}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
