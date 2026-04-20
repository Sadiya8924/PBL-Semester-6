import { useAuth } from '../../lib/auth';
import type { UserRole } from '../../lib/types';

/**
 * withAuth — thin role-gate wrapper.
 *
 * Redirect logic (unauthenticated → /auth/login, wrong role → /)
 * sudah sepenuhnya ditangani oleh _app.tsx sebelum komponen ini
 * pernah di-render. withAuth di sini hanya sebagai:
 *   1. Dokumentasi intent ("halaman ini butuh role X")
 *   2. Safety net render-level: kalau somehow guard di atas dilewati,
 *      komponen tidak akan pernah tampil ke user yang salah.
 */
interface WithAuthOptions {
  requiredRole?: UserRole;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';

  function ProtectedPage(props: P) {
    const { session, profile, loading } = useAuth();

    // _app.tsx sudah menampilkan FullScreenLoader selama loading,
    // tapi tetap guard di sini untuk keamanan ekstra.
    if (loading || !session || !profile) return null;

    // Safety net: jika role tidak sesuai, render null — jangan pernah
    // tampilkan konten admin ke staff walau redirect belum terjadi.
    if (options.requiredRole && profile.role !== options.requiredRole) return null;

    return <Component {...props} />;
  }

  ProtectedPage.displayName = `withAuth(${displayName})`;
  return ProtectedPage;
}
