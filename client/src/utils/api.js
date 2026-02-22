import { supabase } from './supabase';
import { getToken } from './auth';

const withAuth = () => {
    const token = getToken();
    if (token) {
        supabase.realtime.setAuth(token);
        // Ensure REST requests use the token
        supabase.auth.setSession({ access_token: token, refresh_token: '' });
    }
    return supabase;
};

const handleResponse = async (promise) => {
    const { data, error } = await promise;
    if (error) {
        console.error('Supabase Error:', error);
        throw new Error(error.message);
    }
    return { data };
};

export const authAPI = {
    login: async (credentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.username, // UI uses 'username' but Supabase uses email
            password: credentials.password
        });
        if (error) throw new Error(error.message);
        return { data: { token: data.session.access_token } };
    },
};

export const projectsAPI = {
    getAll: async () => {
        const res = await handleResponse(supabase.from('projects').select('*').order('created_at', { ascending: false }));
        return {
            data: res.data.map(p => ({
                ...p, techStack: p.tech_stack, githubLink: p.github_link, liveLink: p.live_link
            }))
        };
    },
    getOne: async (id) => {
        const res = await handleResponse(supabase.from('projects').select('*').eq('id', id).single());
        return {
            data: { ...res.data, techStack: res.data.tech_stack, githubLink: res.data.github_link, liveLink: res.data.live_link }
        };
    },
    create: (data) => {
        const payload = {
            title: data.title,
            description: data.description,
            tech_stack: data.techStack,
            github_link: data.githubLink,
            live_link: data.liveLink,
            featured: data.featured
        };
        return handleResponse(withAuth().from('projects').insert([payload]).select());
    },
    update: (id, data) => {
        const payload = {
            title: data.title,
            description: data.description,
            tech_stack: data.techStack,
            github_link: data.githubLink,
            live_link: data.liveLink,
            featured: data.featured
        };
        return handleResponse(withAuth().from('projects').update(payload).eq('id', id).select());
    },
    delete: (id) => handleResponse(withAuth().from('projects').delete().eq('id', id)),
};

export const blogsAPI = {
    getAll: async (tag) => {
        let query = supabase.from('blogs').select('*').eq('published', true).order('created_at', { ascending: false });
        if (tag) {
            query = query.contains('tags', [tag]);
        }
        const res = await handleResponse(query);
        return { data: res.data.map(b => ({ ...b, coverImage: b.cover_image, createdAt: b.created_at })) };
    },
    getAllAdmin: async () => {
        const res = await handleResponse(withAuth().from('blogs').select('*').order('created_at', { ascending: false }));
        return { data: res.data.map(b => ({ ...b, coverImage: b.cover_image, createdAt: b.created_at })) };
    },
    getBySlug: async (slug) => {
        const res = await handleResponse(supabase.from('blogs').select('*').eq('slug', slug).single());
        return { data: { ...res.data, coverImage: res.data.cover_image } };
    },
    create: (data) => {
        const payload = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            tags: data.tags,
            excerpt: data.excerpt,
            cover_image: data.coverImage,
            published: data.published
        };
        return handleResponse(withAuth().from('blogs').insert([payload]).select());
    },
    update: (id, data) => {
        const payload = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            tags: data.tags,
            excerpt: data.excerpt,
            cover_image: data.coverImage,
            published: data.published
        };
        return handleResponse(withAuth().from('blogs').update(payload).eq('id', id).select());
    },
    delete: (id) => handleResponse(withAuth().from('blogs').delete().eq('id', id)),
};

export const skillsAPI = {
    getAll: () => handleResponse(supabase.from('skills').select('*').order('created_at', { ascending: false })),
    create: (data) => handleResponse(withAuth().from('skills').insert([data]).select()),
    update: (id, data) => handleResponse(withAuth().from('skills').update(data).eq('id', id).select()),
    delete: (id) => handleResponse(withAuth().from('skills').delete().eq('id', id)),
};

export const certificationsAPI = {
    getAll: () => handleResponse(supabase.from('certifications').select('*').order('created_at', { ascending: false })),
    create: (data) => handleResponse(withAuth().from('certifications').insert([data]).select()),
    update: (id, data) => handleResponse(withAuth().from('certifications').update(data).eq('id', id).select()),
    delete: (id) => handleResponse(withAuth().from('certifications').delete().eq('id', id)),
};

export const contactAPI = {
    send: (data) => handleResponse(supabase.from('contact_messages').insert([data]).select()),
    getAll: () => handleResponse(withAuth().from('contact_messages').select('*').order('created_at', { ascending: false })),
    markRead: (id) => handleResponse(withAuth().from('contact_messages').update({ read: true }).eq('id', id).select()),
    delete: (id) => handleResponse(withAuth().from('contact_messages').delete().eq('id', id)),
};

export const githubAPI = {
    getRepos: async () => {
        const username = import.meta.env.VITE_GITHUB_USERNAME || 'Siva-R-Git33';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=owner`);
        if (!response.ok) throw new Error('Failed to fetch GitHub repos');
        const data = await response.json();
        return { data };
    },
};

// We don't export the generic axios instance anymore.
// We just export the individual API route collections.
export default { authAPI, projectsAPI, blogsAPI, skillsAPI, certificationsAPI, contactAPI, githubAPI };
