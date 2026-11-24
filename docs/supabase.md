# Mise en place de Supabase

1. **Projet** : sur supabase.com, créer un projet (région Europe).
2. **Tables** : SQL Editor, coller `supabase/migrations/0001_initial.sql`, Run.
3. **Adresses** : Authentication > URL Configuration. Site URL et Redirect URLs : `https://theohls.github.io/constance/`.
4. **Compte** : Authentication > Users > Add user, avec son e-mail, « Auto Confirm User » coché.
5. **Inscriptions** : Authentication > Sign In / Providers, désactiver « Allow new users to sign up ». Garder Email activé. L'app ne crée jamais de compte (`shouldCreateUser: false`).
6. **Code** : même page, Email : OTP length = 6.
7. **E-mail** : Authentication > Emails > Magic Link, ajouter le code au message en gardant le lien :
   `<p>Your code: {{ .Token }}</p>`
8. **Clés** : GitHub, Settings > Secrets and variables > Actions, créer `VITE_SUPABASE_URL` (Project URL) et `VITE_SUPABASE_ANON_KEY` (clé anon ou publishable). Jamais la clé service_role / secret.
9. **Déployer** : Actions > Deploy > Run workflow.

La clé anon se retrouve dans le JavaScript public : c'est prévu, ce sont les RLS qui protègent les données.
L'envoi d'e-mails intégré à Supabase est très limité en nombre par heure.
