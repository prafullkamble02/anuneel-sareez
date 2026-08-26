import { admin } from '@netlify/identity';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secret = req.headers.get('x-setup-secret');

  if (!secret || secret !== process.env.ADMIN_SETUP_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const users = await admin.listUsers({ perPage: 100 });

    const user = users.find(
      u => u.email?.toLowerCase() === 'neelamc44@gmail.com'
    );

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await admin.updateUser(user.id, {
  app_metadata: {
    ...(user.appMetadata || {}),
    roles: ['admin']
  }
});

    return Response.json({
      success: true,
      message: 'Admin role assigned successfully',
      email: user.email
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
};
