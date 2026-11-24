# Mise en place de Supabase

1. **Projet** : sur supabase.com, créer un projet (région Europe).
2. **Tables** : SQL Editor, coller `supabase/migrations/0001_initial.sql`, Run, puis `0002_quit_habits.sql`.
3. **Adresses** : Authentication > URL Configuration. Site URL et Redirect URLs : `https://theohls.github.io/constance/`.
4. **Inscriptions** : Authentication > Sign In / Providers, « Allow new users to sign up » activé, Email activé. (À désactiver pour fermer l'app.)
5. **Code** : même page, Email : OTP length = 6 (8 par défaut).
6. **SMTP** : Authentication > Emails > SMTP Settings. Obligatoire pour modifier les e-mails et écrire à d'autres personnes que l'équipe Supabase. Gmail : `smtp.gmail.com`, 465, mot de passe d'application.
7. **E-mails** : modèles « Magic link or OTP » et « Confirm sign up », ajouter en gardant le lien :
   `<p>Your code: {{ .Token }}</p>`
8. **Clés** : GitHub, Settings > Secrets and variables > Actions, créer `VITE_SUPABASE_URL` (Project URL) et `VITE_SUPABASE_ANON_KEY` (clé anon ou publishable). Jamais la clé service_role / secret.
9. **Déployer** : Actions > Deploy > Run workflow.

La clé anon se retrouve dans le JavaScript public : c'est prévu, ce sont les RLS qui protègent les données.
Limite d'envoi : 30 e-mails par heure avec le SMTP, modifiable dans Rate Limits.
