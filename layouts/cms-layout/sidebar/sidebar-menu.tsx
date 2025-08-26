import { SIZE_ICON } from '@/constants/common';
import { Link, usePathname } from '@/i18n/routing';
import { useCheckPermission } from '@/modules/auth/hooks/use-permission';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    adminRoutes,
    RouteGroupNode,
    RouteLinkNode,
    RouteNode,
} from '../routes';

type MenuItem = Required<MenuProps>['items'][number];

function SidebarMenu() {
    const pathname = usePathname();
    const t = useTranslations();
    const { checkPermission } = useCheckPermission();

    /** Normalize path, remove trailing slash and optional locale prefix (/en or /en-US) */
    const normalizePath = (path: string) => {
        const noQuery = path.split('?')[0].split('#')[0];
        const parts = noQuery.split('/');
        if (parts.length > 1 && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(parts[1])) {
            // strip locale segment
            parts.splice(1, 1);
        }
        const normalized = parts.join('/') || '/';
        return normalized.endsWith('/') && normalized !== '/'
            ? normalized.slice(0, -1)
            : normalized;
    };

    const pathnameNormalized = normalizePath(pathname);

    /** Permission + hidden filter, keeps groups with (visible children) OR (clickable group href) */
    const pruneTree = (nodes: RouteNode[]): RouteNode[] => {
        const visible = nodes
            .filter((n) => !n.hidden)
            .map((n) =>
                n.type === 'group'
                    ? ({
                          ...n,
                          children: pruneTree(n.children),
                      } as RouteGroupNode)
                    : n
            )
            .filter((n) => checkPermission(n.required));
        return visible.filter((n) =>
            n.type === 'group' ? n.children.length > 0 || !!n.href : true
        );
    };

    const tree = useMemo(
        () => pruneTree(adminRoutes),
        [adminRoutes, checkPermission]
    );

    /** Collect all links for selection logic */
    const collectLinks = (nodes: RouteNode[], acc: RouteLinkNode[] = []) => {
        for (const n of nodes) {
            if (n.type === 'link') acc.push(n);
            else collectLinks(n.children, acc);
        }
        return acc;
    };

    const allLinks = useMemo(() => collectLinks(tree), [tree]);

    /** Choose the deepest link whose href matches the current path by segment prefix */
    const bestActiveLink = useMemo(() => {
        // match when path is equal or starts with `${href}/`
        const matches = allLinks.filter(({ href }) => {
            const h =
                href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href;
            return (
                pathnameNormalized === h ||
                pathnameNormalized.startsWith(h + '/')
            );
        });
        if (matches.length === 0) return undefined;
        return matches.sort((a, b) => b.href.length - a.href.length)[0];
    }, [allLinks, pathnameNormalized]);

    /** Find path (ancestors) to a given href for openKeys */
    const findPathToHref = (
        nodes: RouteNode[],
        href: string,
        trail: RouteNode[] = []
    ): RouteNode[] | undefined => {
        for (const n of nodes) {
            const nextTrail = [...trail, n];
            if (n.type === 'link' && n.href === href) return nextTrail;
            if (n.type === 'group') {
                const found = findPathToHref(n.children, href, nextTrail);
                if (found) return found;
            }
        }
        return undefined;
    };

    const openKeys = useMemo(() => {
        if (!bestActiveLink) return [];
        const path = findPathToHref(tree, bestActiveLink.href) ?? [];
        // Only groups open; use their ids as keys
        return path
            .filter((n): n is RouteGroupNode => n.type === 'group')
            .map((n) => n.id);
    }, [tree, bestActiveLink]);

    /** Build AntD items recursively; top level rendered as 'group' sections */
    const getLabel = (n: RouteNode) => {
        const text = t(n.label as any);
        // external Link
        if (n.external && 'href' in n && n.href) {
            return (
                <a href={n.href} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            );
        }
        // internal Link
        if ('href' in n && n.href) {
            return <Link href={n.href}>{text}</Link>;
        }
        // plain text
        return <span>{text}</span>;
    };

    const toMenuItems = (nodes: RouteNode[], depth = 0): MenuItem[] => {
        return nodes.map((n): MenuItem => {
            if (n.type === 'group') {
                const children = toMenuItems(n.children, depth + 1);
                const base = {
                    key: n.id,
                    label: <span>{t(n.label as any)}</span>,
                    icon: n.icon ? <n.icon size={SIZE_ICON} /> : undefined,
                    children,
                } as MenuItem;

                // Top-level sections as "group" for nice headings; nested groups as submenus
                return depth === 0
                    ? ({ ...base, type: 'group' } as MenuItem)
                    : ({ ...base, label: getLabel(n) } as MenuItem);
            }

            // link leaf
            return {
                key: n.href, // use href for selection
                label: getLabel(n),
                icon: n.icon ? <n.icon size={SIZE_ICON} /> : undefined,
            };
        });
    };

    const items = useMemo(() => {
        const raw = toMenuItems(tree, 0);
        // keep only top-level groups that still have visible children
        // @ts-ignore
        return raw.filter((g) => (g?.children?.length ?? 0) > 0);
    }, [tree]);

    return (
        <Menu
            className="!border-none"
            items={items}
            selectedKeys={bestActiveLink ? [bestActiveLink.href] : []}
            defaultOpenKeys={openKeys}
        />
    );
}

export default SidebarMenu;
