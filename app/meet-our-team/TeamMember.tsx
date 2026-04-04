'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#4caf50" opacity="0.15" />
        <path d="M4.5 8.5l2.5 2.5 4-5" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#c5a059" opacity="0.15" />
        <path d="M5 6.5h6M8 6.5V10m-2-1.5a2 2 0 104 0 2 2 0 00-4 0z" stroke="#c5a059" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
)

const BuildingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="8" fill="#546e7a" opacity="0.15" />
        <path d="M4 12V6l4-2 4 2v6H4zm3-4h2m-2 2h2" stroke="#546e7a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export type BulletType = 'check' | 'camera' | 'building'

export interface BulletItem {
    icon: BulletType
    text: string
}

export interface TeamMemberProps {
    imageSrc: string
    imageAlt: string
    role: string
    name: string
    nmls: string
    bioTitle: string
    bio: string
    bullets: BulletItem[]
    profileHref: string
}

const iconMap: Record<BulletType, React.ReactNode> = {
    check: <CheckIcon />,
    camera: <CameraIcon />,
    building: <BuildingIcon />,
}

export function TeamMember({ imageSrc, imageAlt, role, name, nmls, bioTitle, bio, bullets, profileHref }: TeamMemberProps) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Portrait */}
            <div
                style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    overflow: 'hidden',
                    background: '#f3f3f5',
                }}
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={560}
                    height={420}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 15%',

                    }}
                    onMouseEnter={() => { }}
                    onMouseLeave={() => { }}
                />
            </div>

            {/* Nameplate */}
            <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                <span
                    style={{
                        display: 'block',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#c5a059',
                        marginBottom: '4px',
                    }}
                >
                    {role}
                </span>
                <h2
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.6rem',
                        fontWeight: 400,
                        color: '#1a1a1a',
                        margin: 0,
                        lineHeight: 1.1,
                    }}
                >
                    {name}
                </h2>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{nmls}</p>
            </div>

            {/* Bio */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '20px' }}>
                <p
                    style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.75,
                        color: '#3a3a3a',
                        marginBottom: '20px',
                    }}
                >
                    {bio}
                </p>
                {bullets && bullets.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {bullets.map((b: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {iconMap[b.icon as BulletType]}
                                <span style={{ fontSize: '0.8rem', color: '#1a1a1a' }}>{b.text}</span>
                            </div>
                        ))}
                    </div>
                )}
                installHook.js:1 using deprecated parameters for the initialization function; pass a single object instead
                overrideMethod @ installHook.js:1
                I @ index.js:709
                load @ index.js:852
                _initWasm @ index.js:908
                Y @ index.js:1771
                pe @ index.js:70602
                eval @ index.js:70477
                commitAttachRef @ react-dom-client.development.js:12612
                runWithFiberInDEV @ react-dom-client.development.js:872
                safelyAttachRef @ react-dom-client.development.js:12630
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13188
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13164
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13053
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13048
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13255
                recursivelyTraverseLayoutEffects @ react-dom-client.development.js:14121
                commitLayoutEffectOnFiber @ react-dom-client.development.js:13130
                flushLayoutEffects @ react-dom-client.development.js:16156
                commitRoot @ react-dom-client.development.js:15997
                commitRootWhenReady @ react-dom-client.development.js:15228
                performWorkOnRoot @ react-dom-client.development.js:15147
                performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
                performWorkUntilDeadline @ scheduler.development.js:45
                <canvas>
                    exports.jsx @ react-jsx-runtime.development.js:323
                    $ @ index.js:70593
                    react_stack_bottom_frame @ react-dom-client.development.js:23584
                    renderWithHooksAgain @ react-dom-client.development.js:6893
                    renderWithHooks @ react-dom-client.development.js:6805
                    updateFunctionComponent @ react-dom-client.development.js:9247
                    beginWork @ react-dom-client.development.js:10858
                    runWithFiberInDEV @ react-dom-client.development.js:872
                    performUnitOfWork @ react-dom-client.development.js:15727
                    workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
                    renderRootConcurrent @ react-dom-client.development.js:15696
                    performWorkOnRoot @ react-dom-client.development.js:14990
                    performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
                    performWorkUntilDeadline @ scheduler.development.js:45
                    <$>
                        exports.jsx @ react-jsx-runtime.development.js:323
                        me @ index.js:70602
                        react_stack_bottom_frame @ react-dom-client.development.js:23584
                        renderWithHooksAgain @ react-dom-client.development.js:6893
                        renderWithHooks @ react-dom-client.development.js:6805
                        updateFunctionComponent @ react-dom-client.development.js:9247
                        beginWork @ react-dom-client.development.js:10858
                        runWithFiberInDEV @ react-dom-client.development.js:872
                        performUnitOfWork @ react-dom-client.development.js:15727
                        workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
                        renderRootConcurrent @ react-dom-client.development.js:15696
                        performWorkOnRoot @ react-dom-client.development.js:14990
                        performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
                        performWorkUntilDeadline @ scheduler.development.js:45
                        <me>
                            exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
                            Hero @ C:\Users\jaxon\mockuprealestate\src\components\home\Hero.tsx:221
                            react_stack_bottom_frame @ react-dom-client.development.js:23584
                            renderWithHooksAgain @ react-dom-client.development.js:6893
                            renderWithHooks @ react-dom-client.development.js:6805
                            updateFunctionComponent @ react-dom-client.development.js:9247
                            beginWork @ react-dom-client.development.js:10807
                            runWithFiberInDEV @ react-dom-client.development.js:872
                            performUnitOfWork @ react-dom-client.development.js:15727
                            workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
                            renderRootConcurrent @ react-dom-client.development.js:15696
                            performWorkOnRoot @ react-dom-client.development.js:14990
                            performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
                            performWorkUntilDeadline @ scheduler.development.js:45
                            "use client"
                            Home @ page.tsx:36
                            initializeElement @ react-server-dom-webpack-client.browser.development.js:1377
                            eval @ react-server-dom-webpack-client.browser.development.js:3126
                            initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1273
                            getOutlinedModel @ react-server-dom-webpack-client.browser.development.js:1682
                            parseModelString @ react-server-dom-webpack-client.browser.development.js:2043
                            eval @ react-server-dom-webpack-client.browser.development.js:3056
                            initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1273
                            resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1127
                            processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2958
                            processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2825
                            processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:3028
                            progress @ react-server-dom-webpack-client.browser.development.js:3294
                            <Home>
                                Promise.all @ VM13652 <anonymous>:1
                                    initializeFakeTask @ react-server-dom-webpack-client.browser.development.js:2588
                                    initializeDebugInfo @ react-server-dom-webpack-client.browser.development.js:2613
                                    initializeDebugChunk @ react-server-dom-webpack-client.browser.development.js:1220
                                    processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2909
                                    processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2825
                                    processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:3028
                                    progress @ react-server-dom-webpack-client.browser.development.js:3294
                                    "use server"
                                    ResponseInstance @ react-server-dom-webpack-client.browser.development.js:2091
                                    createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:3155
                                    exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:3540
                                    eval @ app-index.js:130
                                    (app-pages-browser)/./node_modules/next/dist/client/app-index.js @ main-app.js?v=1775324320384:160
                                    options.factory @ webpack.js:1
                                    __webpack_require__ @ webpack.js:1
                                    fn @ webpack.js:1
                                    eval @ app-next-dev.js:14
                                    eval @ app-bootstrap.js:59
                                    loadScriptsInSequence @ app-bootstrap.js:24
                                    appBootstrap @ app-bootstrap.js:53
                                    eval @ app-next-dev.js:13
                                    (app-pages-browser)/./node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1775324320384:182
                                    options.factory @ webpack.js:1
                                    __webpack_require__ @ webpack.js:1
                                    __webpack_exec__ @ main-app.js?v=1775324320384:1878
                                    (anonymous) @ main-app.js?v=1775324320384:1879
                                    webpackJsonpCallback @ webpack.js:1
                                    (anonymous) @ main-app.js?v=1775324320384:9
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    f @ O4aTHuS-3U8.js:336
                                    (anonymous) @ O4aTHuS-3U8.js:330
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    i.$13 @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    i.$11 @ O4aTHuS-3U8.js:242
                                    (anonymous) @ O4aTHuS-3U8.js:242
                                    _ @ O4aTHuS-3U8.js:242
                                    i.$5 @ O4aTHuS-3U8.js:242
                                    i.handle @ O4aTHuS-3U8.js:242
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    W @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    se @ O4aTHuS-3U8.js:64
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    f @ O4aTHuS-3U8.js:336
                                    (anonymous) @ O4aTHuS-3U8.js:330
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    i.$13 @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    i.$11 @ O4aTHuS-3U8.js:242
                                    (anonymous) @ O4aTHuS-3U8.js:242
                                    _ @ O4aTHuS-3U8.js:242
                                    i.$5 @ O4aTHuS-3U8.js:242
                                    i.handle @ O4aTHuS-3U8.js:242
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    W @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    se @ O4aTHuS-3U8.js:64
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    f @ O4aTHuS-3U8.js:336
                                    (anonymous) @ O4aTHuS-3U8.js:330
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    i.$13 @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    i.$11 @ O4aTHuS-3U8.js:242
                                    (anonymous) @ O4aTHuS-3U8.js:242
                                    _ @ O4aTHuS-3U8.js:242
                                    i.$5 @ O4aTHuS-3U8.js:242
                                    i.handle @ O4aTHuS-3U8.js:242
                                    (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                    W @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    se @ O4aTHuS-3U8.js:64
                                    (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    f @ O4aTHuS-3U8.js:336
                                    (anonymous) @ O4aTHuS-3U8.js:330
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    i.$13 @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    i.$11 @ O4aTHuS-3U8.js:242
                                    (anonymous) @ O4aTHuS-3U8.js:242
                                    _ @ O4aTHuS-3U8.js:242
                                    i.$5 @ O4aTHuS-3U8.js:242
                                    i.handle @ O4aTHuS-3U8.js:242
                                    (anonymous) @ www.instagram.com/p/…ost%3A3000&rp=%2F:8
                                    W @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    se @ O4aTHuS-3U8.js:64
                                    (anonymous) @ www.instagram.com/p/…ost%3A3000&rp=%2F:8
                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    f @ O4aTHuS-3U8.js:336
                                    (anonymous) @ O4aTHuS-3U8.js:330
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    i.$13 @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    i.$11 @ O4aTHuS-3U8.js:242
                                    (anonymous) @ O4aTHuS-3U8.js:242
                                    _ @ O4aTHuS-3U8.js:242
                                    i.$5 @ O4aTHuS-3U8.js:242
                                    i.handle @ O4aTHuS-3U8.js:242
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    W @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    se @ O4aTHuS-3U8.js:64
                                    (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    g @ O4aTHuS-3U8.js:336
                                    (anonymous) @ y7q9Al9EMSE.js:17
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    Te.root @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    t.__d @ O4aTHuS-3U8.js:64
                                    (anonymous) @ y7q9Al9EMSE.js:17
                                    PendingScript
                                    c @ O4aTHuS-3U8.js:95
                                    loadResources @ O4aTHuS-3U8.js:192
                                    o @ O4aTHuS-3U8.js:277
                                    (anonymous) @ O4aTHuS-3U8.js:277
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    n.$5 @ O4aTHuS-3U8.js:90
                                    t.$5 @ O4aTHuS-3U8.js:90
                                    r @ O4aTHuS-3U8.js:90
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                    r.emit @ O4aTHuS-3U8.js:86
                                    t.emitAndHold @ O4aTHuS-3U8.js:88
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.$6 @ O4aTHuS-3U8.js:80
                                    r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                    n.$6 @ O4aTHuS-3U8.js:90
                                    t.$6 @ O4aTHuS-3U8.js:90
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    y_LwupOkOQg.js:31 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    e @ y_LwupOkOQg.js:31
                                    listen @ y_LwupOkOQg.js:31
                                    F @ ggUmxTZcUv5.js:42
                                    e @ ggUmxTZcUv5.js:44
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    Te.root @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    t.__d @ O4aTHuS-3U8.js:64
                                    (anonymous) @ 7v8MK3eHKrG.js:140
                                    PendingScript
                                    c @ O4aTHuS-3U8.js:95
                                    loadResources @ O4aTHuS-3U8.js:192
                                    o @ O4aTHuS-3U8.js:277
                                    (anonymous) @ O4aTHuS-3U8.js:277
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    n.$5 @ O4aTHuS-3U8.js:90
                                    t.$5 @ O4aTHuS-3U8.js:90
                                    r @ O4aTHuS-3U8.js:90
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                    r.emit @ O4aTHuS-3U8.js:86
                                    t.emitAndHold @ O4aTHuS-3U8.js:88
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.$6 @ O4aTHuS-3U8.js:80
                                    r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                    n.$6 @ O4aTHuS-3U8.js:90
                                    t.$6 @ O4aTHuS-3U8.js:90
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    _ @ O4aTHuS-3U8.js:336
                                    g @ O4aTHuS-3U8.js:336
                                    (anonymous) @ y7q9Al9EMSE.js:17
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    Te.root @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    t.__d @ O4aTHuS-3U8.js:64
                                    (anonymous) @ y7q9Al9EMSE.js:17
                                    PendingScript
                                    c @ O4aTHuS-3U8.js:95
                                    loadResources @ O4aTHuS-3U8.js:192
                                    o @ O4aTHuS-3U8.js:277
                                    (anonymous) @ O4aTHuS-3U8.js:277
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    n.$5 @ O4aTHuS-3U8.js:90
                                    t.$5 @ O4aTHuS-3U8.js:90
                                    r @ O4aTHuS-3U8.js:90
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                    r.emit @ O4aTHuS-3U8.js:86
                                    t.emitAndHold @ O4aTHuS-3U8.js:88
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.$6 @ O4aTHuS-3U8.js:80
                                    r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                    n.$6 @ O4aTHuS-3U8.js:90
                                    t.$6 @ O4aTHuS-3U8.js:90
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    y_LwupOkOQg.js:31 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    e @ y_LwupOkOQg.js:31
                                    listen @ y_LwupOkOQg.js:31
                                    F @ ggUmxTZcUv5.js:42
                                    e @ ggUmxTZcUv5.js:44
                                    v.guard.name @ O4aTHuS-3U8.js:242
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    e @ O4aTHuS-3U8.js:78
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    A @ O4aTHuS-3U8.js:64
                                    (anonymous) @ O4aTHuS-3U8.js:64
                                    oe @ O4aTHuS-3U8.js:64
                                    Te.root @ O4aTHuS-3U8.js:64
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    t.__d @ O4aTHuS-3U8.js:64
                                    (anonymous) @ 7v8MK3eHKrG.js:140
                                    PendingScript
                                    c @ O4aTHuS-3U8.js:95
                                    loadResources @ O4aTHuS-3U8.js:192
                                    o @ O4aTHuS-3U8.js:277
                                    (anonymous) @ O4aTHuS-3U8.js:277
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    n.$5 @ O4aTHuS-3U8.js:90
                                    t.$5 @ O4aTHuS-3U8.js:90
                                    r @ O4aTHuS-3U8.js:90
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                    r.emit @ O4aTHuS-3U8.js:86
                                    t.emitAndHold @ O4aTHuS-3U8.js:88
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    r.$6 @ O4aTHuS-3U8.js:80
                                    r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                    n.$6 @ O4aTHuS-3U8.js:90
                                    t.$6 @ O4aTHuS-3U8.js:90
                                    n.inform @ O4aTHuS-3U8.js:90
                                    t.inform @ O4aTHuS-3U8.js:90
                                    (anonymous) @ O4aTHuS-3U8.js:336
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    3lEmVHWqBit.js:29 [Violation] Permissions policy violation: unload is not allowed in this document.
                                    e @ 3lEmVHWqBit.js:29
                                    setUnloadHook @ 3lEmVHWqBit.js:116
                                    s._initialize @ 3lEmVHWqBit.js:118
                                    (anonymous) @ 3lEmVHWqBit.js:118
                                    W @ O4aTHuS-3U8.js:64
                                    M @ O4aTHuS-3U8.js:64
                                    F @ O4aTHuS-3U8.js:64
                                    y @ 3lEmVHWqBit.js:125
                                    m @ ggUmxTZcUv5.js:24
                                    p @ ggUmxTZcUv5.js:24
                                    (anonymous) @ ggUmxTZcUv5.js:42
                                    e @ O4aTHuS-3U8.js:342
                                    p @ O4aTHuS-3U8.js:342
                                    d @ O4aTHuS-3U8.js:334
                                    (anonymous) @ O4aTHuS-3U8.js:334
                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                    p @ O4aTHuS-3U8.js:342
                                    o.<computed> @ O4aTHuS-3U8.js:197
                                        g @ O4aTHuS-3U8.js:197
                                        e.port1.onmessage @ O4aTHuS-3U8.js:197
                                        3lEmVHWqBit.js:29 [Violation] Permissions policy violation: unload is not allowed in this document.
                                        e @ 3lEmVHWqBit.js:29
                                        setUnloadHook @ 3lEmVHWqBit.js:116
                                        s._initialize @ 3lEmVHWqBit.js:118
                                        (anonymous) @ 3lEmVHWqBit.js:118
                                        W @ O4aTHuS-3U8.js:64
                                        M @ O4aTHuS-3U8.js:64
                                        F @ O4aTHuS-3U8.js:64
                                        y @ 3lEmVHWqBit.js:125
                                        m @ ggUmxTZcUv5.js:24
                                        p @ ggUmxTZcUv5.js:24
                                        (anonymous) @ ggUmxTZcUv5.js:42
                                        e @ O4aTHuS-3U8.js:342
                                        p @ O4aTHuS-3U8.js:342
                                        d @ O4aTHuS-3U8.js:334
                                        (anonymous) @ O4aTHuS-3U8.js:334
                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                        p @ O4aTHuS-3U8.js:342
                                        o.<computed> @ O4aTHuS-3U8.js:197
                                            g @ O4aTHuS-3U8.js:197
                                            e.port1.onmessage @ O4aTHuS-3U8.js:197
                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                            _ @ O4aTHuS-3U8.js:336
                                            g @ O4aTHuS-3U8.js:336
                                            (anonymous) @ y7q9Al9EMSE.js:17
                                            W @ O4aTHuS-3U8.js:64
                                            M @ O4aTHuS-3U8.js:64
                                            A @ O4aTHuS-3U8.js:64
                                            v.guard.name @ O4aTHuS-3U8.js:242
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            e @ O4aTHuS-3U8.js:78
                                            W @ O4aTHuS-3U8.js:64
                                            M @ O4aTHuS-3U8.js:64
                                            A @ O4aTHuS-3U8.js:64
                                            (anonymous) @ O4aTHuS-3U8.js:64
                                            oe @ O4aTHuS-3U8.js:64
                                            Te.root @ O4aTHuS-3U8.js:64
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            p @ O4aTHuS-3U8.js:342
                                            t.__d @ O4aTHuS-3U8.js:64
                                            (anonymous) @ y7q9Al9EMSE.js:17
                                            PendingScript
                                            c @ O4aTHuS-3U8.js:95
                                            loadResources @ O4aTHuS-3U8.js:192
                                            o @ O4aTHuS-3U8.js:277
                                            (anonymous) @ O4aTHuS-3U8.js:277
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            n.$5 @ O4aTHuS-3U8.js:90
                                            t.$5 @ O4aTHuS-3U8.js:90
                                            r @ O4aTHuS-3U8.js:90
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                            r.emit @ O4aTHuS-3U8.js:86
                                            t.emitAndHold @ O4aTHuS-3U8.js:88
                                            n.inform @ O4aTHuS-3U8.js:90
                                            t.inform @ O4aTHuS-3U8.js:90
                                            (anonymous) @ O4aTHuS-3U8.js:336
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            r.$6 @ O4aTHuS-3U8.js:80
                                            r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                            n.$6 @ O4aTHuS-3U8.js:90
                                            t.$6 @ O4aTHuS-3U8.js:90
                                            n.inform @ O4aTHuS-3U8.js:90
                                            t.inform @ O4aTHuS-3U8.js:90
                                            (anonymous) @ O4aTHuS-3U8.js:336
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            p @ O4aTHuS-3U8.js:342
                                            y_LwupOkOQg.js:31 [Violation] Permissions policy violation: unload is not allowed in this document.
                                            e @ y_LwupOkOQg.js:31
                                            listen @ y_LwupOkOQg.js:31
                                            F @ ggUmxTZcUv5.js:42
                                            e @ ggUmxTZcUv5.js:44
                                            v.guard.name @ O4aTHuS-3U8.js:242
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            e @ O4aTHuS-3U8.js:78
                                            W @ O4aTHuS-3U8.js:64
                                            M @ O4aTHuS-3U8.js:64
                                            A @ O4aTHuS-3U8.js:64
                                            (anonymous) @ O4aTHuS-3U8.js:64
                                            oe @ O4aTHuS-3U8.js:64
                                            Te.root @ O4aTHuS-3U8.js:64
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            p @ O4aTHuS-3U8.js:342
                                            t.__d @ O4aTHuS-3U8.js:64
                                            (anonymous) @ 7v8MK3eHKrG.js:140
                                            PendingScript
                                            c @ O4aTHuS-3U8.js:95
                                            loadResources @ O4aTHuS-3U8.js:192
                                            o @ O4aTHuS-3U8.js:277
                                            (anonymous) @ O4aTHuS-3U8.js:277
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            n.$5 @ O4aTHuS-3U8.js:90
                                            t.$5 @ O4aTHuS-3U8.js:90
                                            r @ O4aTHuS-3U8.js:90
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                            r.emit @ O4aTHuS-3U8.js:86
                                            t.emitAndHold @ O4aTHuS-3U8.js:88
                                            n.inform @ O4aTHuS-3U8.js:90
                                            t.inform @ O4aTHuS-3U8.js:90
                                            (anonymous) @ O4aTHuS-3U8.js:336
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            r.$6 @ O4aTHuS-3U8.js:80
                                            r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                            n.$6 @ O4aTHuS-3U8.js:90
                                            t.$6 @ O4aTHuS-3U8.js:90
                                            n.inform @ O4aTHuS-3U8.js:90
                                            t.inform @ O4aTHuS-3U8.js:90
                                            (anonymous) @ O4aTHuS-3U8.js:336
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            p @ O4aTHuS-3U8.js:342
                                            3lEmVHWqBit.js:29 [Violation] Permissions policy violation: unload is not allowed in this document.
                                            e @ 3lEmVHWqBit.js:29
                                            setUnloadHook @ 3lEmVHWqBit.js:116
                                            s._initialize @ 3lEmVHWqBit.js:118
                                            (anonymous) @ 3lEmVHWqBit.js:118
                                            W @ O4aTHuS-3U8.js:64
                                            M @ O4aTHuS-3U8.js:64
                                            F @ O4aTHuS-3U8.js:64
                                            y @ 3lEmVHWqBit.js:125
                                            m @ ggUmxTZcUv5.js:24
                                            p @ ggUmxTZcUv5.js:24
                                            (anonymous) @ ggUmxTZcUv5.js:42
                                            e @ O4aTHuS-3U8.js:342
                                            p @ O4aTHuS-3U8.js:342
                                            d @ O4aTHuS-3U8.js:334
                                            (anonymous) @ O4aTHuS-3U8.js:334
                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                            p @ O4aTHuS-3U8.js:342
                                            o.<computed> @ O4aTHuS-3U8.js:197
                                                g @ O4aTHuS-3U8.js:197
                                                e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                _ @ O4aTHuS-3U8.js:336
                                                f @ O4aTHuS-3U8.js:336
                                                (anonymous) @ O4aTHuS-3U8.js:330
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                i.$13 @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                i.$11 @ O4aTHuS-3U8.js:242
                                                (anonymous) @ O4aTHuS-3U8.js:242
                                                _ @ O4aTHuS-3U8.js:242
                                                i.$5 @ O4aTHuS-3U8.js:242
                                                i.handle @ O4aTHuS-3U8.js:242
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                W @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                se @ O4aTHuS-3U8.js:64
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                _ @ O4aTHuS-3U8.js:336
                                                f @ O4aTHuS-3U8.js:336
                                                (anonymous) @ O4aTHuS-3U8.js:330
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                i.$13 @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                i.$11 @ O4aTHuS-3U8.js:242
                                                (anonymous) @ O4aTHuS-3U8.js:242
                                                _ @ O4aTHuS-3U8.js:242
                                                i.$5 @ O4aTHuS-3U8.js:242
                                                i.handle @ O4aTHuS-3U8.js:242
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                W @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                se @ O4aTHuS-3U8.js:64
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                _ @ O4aTHuS-3U8.js:336
                                                f @ O4aTHuS-3U8.js:336
                                                (anonymous) @ O4aTHuS-3U8.js:330
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                i.$13 @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                i.$11 @ O4aTHuS-3U8.js:242
                                                (anonymous) @ O4aTHuS-3U8.js:242
                                                _ @ O4aTHuS-3U8.js:242
                                                i.$5 @ O4aTHuS-3U8.js:242
                                                i.handle @ O4aTHuS-3U8.js:242
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                W @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                se @ O4aTHuS-3U8.js:64
                                                (anonymous) @ embed/?cr=1&v=14&wp=…ost%3A3000&rp=%2F:8
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                _ @ O4aTHuS-3U8.js:336
                                                g @ O4aTHuS-3U8.js:336
                                                (anonymous) @ y7q9Al9EMSE.js:17
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                Te.root @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                t.__d @ O4aTHuS-3U8.js:64
                                                (anonymous) @ y7q9Al9EMSE.js:17
                                                PendingScript
                                                c @ O4aTHuS-3U8.js:95
                                                loadResources @ O4aTHuS-3U8.js:192
                                                o @ O4aTHuS-3U8.js:277
                                                (anonymous) @ O4aTHuS-3U8.js:277
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                n.$5 @ O4aTHuS-3U8.js:90
                                                t.$5 @ O4aTHuS-3U8.js:90
                                                r @ O4aTHuS-3U8.js:90
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                r.emit @ O4aTHuS-3U8.js:86
                                                t.emitAndHold @ O4aTHuS-3U8.js:88
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.$6 @ O4aTHuS-3U8.js:80
                                                r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                n.$6 @ O4aTHuS-3U8.js:90
                                                t.$6 @ O4aTHuS-3U8.js:90
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                e @ y_LwupOkOQg.js:31
                                                listen @ y_LwupOkOQg.js:31
                                                F @ ggUmxTZcUv5.js:42
                                                e @ ggUmxTZcUv5.js:44
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                Te.root @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                t.__d @ O4aTHuS-3U8.js:64
                                                (anonymous) @ 7v8MK3eHKrG.js:140
                                                PendingScript
                                                c @ O4aTHuS-3U8.js:95
                                                loadResources @ O4aTHuS-3U8.js:192
                                                o @ O4aTHuS-3U8.js:277
                                                (anonymous) @ O4aTHuS-3U8.js:277
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                n.$5 @ O4aTHuS-3U8.js:90
                                                t.$5 @ O4aTHuS-3U8.js:90
                                                r @ O4aTHuS-3U8.js:90
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                r.emit @ O4aTHuS-3U8.js:86
                                                t.emitAndHold @ O4aTHuS-3U8.js:88
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.$6 @ O4aTHuS-3U8.js:80
                                                r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                n.$6 @ O4aTHuS-3U8.js:90
                                                t.$6 @ O4aTHuS-3U8.js:90
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                _ @ O4aTHuS-3U8.js:336
                                                g @ O4aTHuS-3U8.js:336
                                                (anonymous) @ y7q9Al9EMSE.js:17
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                Te.root @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                t.__d @ O4aTHuS-3U8.js:64
                                                (anonymous) @ y7q9Al9EMSE.js:17
                                                PendingScript
                                                c @ O4aTHuS-3U8.js:95
                                                loadResources @ O4aTHuS-3U8.js:192
                                                o @ O4aTHuS-3U8.js:277
                                                (anonymous) @ O4aTHuS-3U8.js:277
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                n.$5 @ O4aTHuS-3U8.js:90
                                                t.$5 @ O4aTHuS-3U8.js:90
                                                r @ O4aTHuS-3U8.js:90
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                r.emit @ O4aTHuS-3U8.js:86
                                                t.emitAndHold @ O4aTHuS-3U8.js:88
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.$6 @ O4aTHuS-3U8.js:80
                                                r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                n.$6 @ O4aTHuS-3U8.js:90
                                                t.$6 @ O4aTHuS-3U8.js:90
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                e @ y_LwupOkOQg.js:31
                                                listen @ y_LwupOkOQg.js:31
                                                F @ ggUmxTZcUv5.js:42
                                                e @ ggUmxTZcUv5.js:44
                                                v.guard.name @ O4aTHuS-3U8.js:242
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                e @ O4aTHuS-3U8.js:78
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                A @ O4aTHuS-3U8.js:64
                                                (anonymous) @ O4aTHuS-3U8.js:64
                                                oe @ O4aTHuS-3U8.js:64
                                                Te.root @ O4aTHuS-3U8.js:64
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                t.__d @ O4aTHuS-3U8.js:64
                                                (anonymous) @ 7v8MK3eHKrG.js:140
                                                PendingScript
                                                c @ O4aTHuS-3U8.js:95
                                                loadResources @ O4aTHuS-3U8.js:192
                                                o @ O4aTHuS-3U8.js:277
                                                (anonymous) @ O4aTHuS-3U8.js:277
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                n.$5 @ O4aTHuS-3U8.js:90
                                                t.$5 @ O4aTHuS-3U8.js:90
                                                r @ O4aTHuS-3U8.js:90
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                r.emit @ O4aTHuS-3U8.js:86
                                                t.emitAndHold @ O4aTHuS-3U8.js:88
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                r.$6 @ O4aTHuS-3U8.js:80
                                                r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                n.$6 @ O4aTHuS-3U8.js:90
                                                t.$6 @ O4aTHuS-3U8.js:90
                                                n.inform @ O4aTHuS-3U8.js:90
                                                t.inform @ O4aTHuS-3U8.js:90
                                                (anonymous) @ O4aTHuS-3U8.js:336
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                [Violation] Permissions policy violation: unload is not allowed in this document.
                                                e @ 3lEmVHWqBit.js:29
                                                setUnloadHook @ 3lEmVHWqBit.js:116
                                                s._initialize @ 3lEmVHWqBit.js:118
                                                (anonymous) @ 3lEmVHWqBit.js:118
                                                W @ O4aTHuS-3U8.js:64
                                                M @ O4aTHuS-3U8.js:64
                                                F @ O4aTHuS-3U8.js:64
                                                y @ 3lEmVHWqBit.js:125
                                                m @ ggUmxTZcUv5.js:24
                                                p @ ggUmxTZcUv5.js:24
                                                (anonymous) @ ggUmxTZcUv5.js:42
                                                e @ O4aTHuS-3U8.js:342
                                                p @ O4aTHuS-3U8.js:342
                                                d @ O4aTHuS-3U8.js:334
                                                (anonymous) @ O4aTHuS-3U8.js:334
                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                p @ O4aTHuS-3U8.js:342
                                                o.<computed> @ O4aTHuS-3U8.js:197
                                                    g @ O4aTHuS-3U8.js:197
                                                    e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                    [Violation] Permissions policy violation: unload is not allowed in this document.
                                                    e @ 3lEmVHWqBit.js:29
                                                    setUnloadHook @ 3lEmVHWqBit.js:116
                                                    s._initialize @ 3lEmVHWqBit.js:118
                                                    (anonymous) @ 3lEmVHWqBit.js:118
                                                    W @ O4aTHuS-3U8.js:64
                                                    M @ O4aTHuS-3U8.js:64
                                                    F @ O4aTHuS-3U8.js:64
                                                    y @ 3lEmVHWqBit.js:125
                                                    m @ ggUmxTZcUv5.js:24
                                                    p @ ggUmxTZcUv5.js:24
                                                    (anonymous) @ ggUmxTZcUv5.js:42
                                                    e @ O4aTHuS-3U8.js:342
                                                    p @ O4aTHuS-3U8.js:342
                                                    d @ O4aTHuS-3U8.js:334
                                                    (anonymous) @ O4aTHuS-3U8.js:334
                                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                                    p @ O4aTHuS-3U8.js:342
                                                    o.<computed> @ O4aTHuS-3U8.js:197
                                                        g @ O4aTHuS-3U8.js:197
                                                        e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                        [Violation] Permissions policy violation: unload is not allowed in this document.
                                                        _ @ O4aTHuS-3U8.js:336
                                                        g @ O4aTHuS-3U8.js:336
                                                        (anonymous) @ y7q9Al9EMSE.js:17
                                                        W @ O4aTHuS-3U8.js:64
                                                        M @ O4aTHuS-3U8.js:64
                                                        A @ O4aTHuS-3U8.js:64
                                                        v.guard.name @ O4aTHuS-3U8.js:242
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        e @ O4aTHuS-3U8.js:78
                                                        W @ O4aTHuS-3U8.js:64
                                                        M @ O4aTHuS-3U8.js:64
                                                        A @ O4aTHuS-3U8.js:64
                                                        (anonymous) @ O4aTHuS-3U8.js:64
                                                        oe @ O4aTHuS-3U8.js:64
                                                        Te.root @ O4aTHuS-3U8.js:64
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        p @ O4aTHuS-3U8.js:342
                                                        t.__d @ O4aTHuS-3U8.js:64
                                                        (anonymous) @ y7q9Al9EMSE.js:17
                                                        PendingScript
                                                        c @ O4aTHuS-3U8.js:95
                                                        loadResources @ O4aTHuS-3U8.js:192
                                                        o @ O4aTHuS-3U8.js:277
                                                        (anonymous) @ O4aTHuS-3U8.js:277
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        n.$5 @ O4aTHuS-3U8.js:90
                                                        t.$5 @ O4aTHuS-3U8.js:90
                                                        r @ O4aTHuS-3U8.js:90
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                        r.emit @ O4aTHuS-3U8.js:86
                                                        t.emitAndHold @ O4aTHuS-3U8.js:88
                                                        n.inform @ O4aTHuS-3U8.js:90
                                                        t.inform @ O4aTHuS-3U8.js:90
                                                        (anonymous) @ O4aTHuS-3U8.js:336
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        r.$6 @ O4aTHuS-3U8.js:80
                                                        r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                        n.$6 @ O4aTHuS-3U8.js:90
                                                        t.$6 @ O4aTHuS-3U8.js:90
                                                        n.inform @ O4aTHuS-3U8.js:90
                                                        t.inform @ O4aTHuS-3U8.js:90
                                                        (anonymous) @ O4aTHuS-3U8.js:336
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        p @ O4aTHuS-3U8.js:342
                                                        [Violation] Permissions policy violation: unload is not allowed in this document.
                                                        e @ y_LwupOkOQg.js:31
                                                        listen @ y_LwupOkOQg.js:31
                                                        F @ ggUmxTZcUv5.js:42
                                                        e @ ggUmxTZcUv5.js:44
                                                        v.guard.name @ O4aTHuS-3U8.js:242
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        e @ O4aTHuS-3U8.js:78
                                                        W @ O4aTHuS-3U8.js:64
                                                        M @ O4aTHuS-3U8.js:64
                                                        A @ O4aTHuS-3U8.js:64
                                                        (anonymous) @ O4aTHuS-3U8.js:64
                                                        oe @ O4aTHuS-3U8.js:64
                                                        Te.root @ O4aTHuS-3U8.js:64
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        p @ O4aTHuS-3U8.js:342
                                                        t.__d @ O4aTHuS-3U8.js:64
                                                        (anonymous) @ 7v8MK3eHKrG.js:140
                                                        PendingScript
                                                        c @ O4aTHuS-3U8.js:95
                                                        loadResources @ O4aTHuS-3U8.js:192
                                                        o @ O4aTHuS-3U8.js:277
                                                        (anonymous) @ O4aTHuS-3U8.js:277
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        n.$5 @ O4aTHuS-3U8.js:90
                                                        t.$5 @ O4aTHuS-3U8.js:90
                                                        r @ O4aTHuS-3U8.js:90
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                        r.emit @ O4aTHuS-3U8.js:86
                                                        t.emitAndHold @ O4aTHuS-3U8.js:88
                                                        n.inform @ O4aTHuS-3U8.js:90
                                                        t.inform @ O4aTHuS-3U8.js:90
                                                        (anonymous) @ O4aTHuS-3U8.js:336
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        r.$6 @ O4aTHuS-3U8.js:80
                                                        r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                        n.$6 @ O4aTHuS-3U8.js:90
                                                        t.$6 @ O4aTHuS-3U8.js:90
                                                        n.inform @ O4aTHuS-3U8.js:90
                                                        t.inform @ O4aTHuS-3U8.js:90
                                                        (anonymous) @ O4aTHuS-3U8.js:336
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        p @ O4aTHuS-3U8.js:342
                                                        [Violation] Permissions policy violation: unload is not allowed in this document.
                                                        e @ 3lEmVHWqBit.js:29
                                                        setUnloadHook @ 3lEmVHWqBit.js:116
                                                        s._initialize @ 3lEmVHWqBit.js:118
                                                        (anonymous) @ 3lEmVHWqBit.js:118
                                                        W @ O4aTHuS-3U8.js:64
                                                        M @ O4aTHuS-3U8.js:64
                                                        F @ O4aTHuS-3U8.js:64
                                                        y @ 3lEmVHWqBit.js:125
                                                        m @ ggUmxTZcUv5.js:24
                                                        p @ ggUmxTZcUv5.js:24
                                                        (anonymous) @ ggUmxTZcUv5.js:42
                                                        e @ O4aTHuS-3U8.js:342
                                                        p @ O4aTHuS-3U8.js:342
                                                        d @ O4aTHuS-3U8.js:334
                                                        (anonymous) @ O4aTHuS-3U8.js:334
                                                        applyWithGuard @ O4aTHuS-3U8.js:78
                                                        p @ O4aTHuS-3U8.js:342
                                                        o.<computed> @ O4aTHuS-3U8.js:197
                                                            g @ O4aTHuS-3U8.js:197
                                                            e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            (anonymous) @ O4aTHuS-3U8.js:330
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            v.guard.name @ O4aTHuS-3U8.js:242
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            e @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ O4aTHuS-3U8.js:64
                                                            oe @ O4aTHuS-3U8.js:64
                                                            i.$13 @ O4aTHuS-3U8.js:242
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            i.$11 @ O4aTHuS-3U8.js:242
                                                            (anonymous) @ O4aTHuS-3U8.js:242
                                                            _ @ O4aTHuS-3U8.js:242
                                                            i.$5 @ O4aTHuS-3U8.js:242
                                                            i.handle @ O4aTHuS-3U8.js:242
                                                            (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                                            W @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ O4aTHuS-3U8.js:64
                                                            oe @ O4aTHuS-3U8.js:64
                                                            se @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ embed/?cr=1&v=14&wp=220&rd=http%3A%2F%2Flocalhost%3A3000&rp=%2F:8
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            t @ bv18pDUd4of.js:96
                                                            (anonymous) @ bv18pDUd4of.js:96
                                                            W @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            F @ O4aTHuS-3U8.js:64
                                                            n.qplMarkerStart @ mhdg36vZfaR.js:101
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            t @ bv18pDUd4of.js:96
                                                            (anonymous) @ bv18pDUd4of.js:96
                                                            W @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            F @ O4aTHuS-3U8.js:64
                                                            n.qplMarkerStart @ mhdg36vZfaR.js:101
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            g @ O4aTHuS-3U8.js:336
                                                            (anonymous) @ y7q9Al9EMSE.js:17
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            v.guard.name @ O4aTHuS-3U8.js:242
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            e @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ O4aTHuS-3U8.js:64
                                                            oe @ O4aTHuS-3U8.js:64
                                                            Te.root @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            p @ O4aTHuS-3U8.js:342
                                                            t.__d @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ y7q9Al9EMSE.js:17
                                                            PendingScript
                                                            c @ O4aTHuS-3U8.js:95
                                                            loadResources @ O4aTHuS-3U8.js:192
                                                            o @ O4aTHuS-3U8.js:277
                                                            (anonymous) @ O4aTHuS-3U8.js:277
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            n.$5 @ O4aTHuS-3U8.js:90
                                                            t.$5 @ O4aTHuS-3U8.js:90
                                                            r @ O4aTHuS-3U8.js:90
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                            r.emit @ O4aTHuS-3U8.js:86
                                                            t.emitAndHold @ O4aTHuS-3U8.js:88
                                                            n.inform @ O4aTHuS-3U8.js:90
                                                            t.inform @ O4aTHuS-3U8.js:90
                                                            (anonymous) @ O4aTHuS-3U8.js:336
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            r.$6 @ O4aTHuS-3U8.js:80
                                                            r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                            n.$6 @ O4aTHuS-3U8.js:90
                                                            t.$6 @ O4aTHuS-3U8.js:90
                                                            n.inform @ O4aTHuS-3U8.js:90
                                                            t.inform @ O4aTHuS-3U8.js:90
                                                            (anonymous) @ O4aTHuS-3U8.js:336
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            p @ O4aTHuS-3U8.js:342
                                                            y_LwupOkOQg.js:31 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            e @ y_LwupOkOQg.js:31
                                                            listen @ y_LwupOkOQg.js:31
                                                            F @ ggUmxTZcUv5.js:42
                                                            e @ ggUmxTZcUv5.js:44
                                                            v.guard.name @ O4aTHuS-3U8.js:242
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            e @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            A @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ O4aTHuS-3U8.js:64
                                                            oe @ O4aTHuS-3U8.js:64
                                                            Te.root @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            p @ O4aTHuS-3U8.js:342
                                                            t.__d @ O4aTHuS-3U8.js:64
                                                            (anonymous) @ 7v8MK3eHKrG.js:140
                                                            PendingScript
                                                            c @ O4aTHuS-3U8.js:95
                                                            loadResources @ O4aTHuS-3U8.js:192
                                                            o @ O4aTHuS-3U8.js:277
                                                            (anonymous) @ O4aTHuS-3U8.js:277
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            n.$5 @ O4aTHuS-3U8.js:90
                                                            t.$5 @ O4aTHuS-3U8.js:90
                                                            r @ O4aTHuS-3U8.js:90
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            r.__emitToSubscription @ O4aTHuS-3U8.js:86
                                                            r.emit @ O4aTHuS-3U8.js:86
                                                            t.emitAndHold @ O4aTHuS-3U8.js:88
                                                            n.inform @ O4aTHuS-3U8.js:90
                                                            t.inform @ O4aTHuS-3U8.js:90
                                                            (anonymous) @ O4aTHuS-3U8.js:336
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            r.$6 @ O4aTHuS-3U8.js:80
                                                            r.satisfyPersistentDependency @ O4aTHuS-3U8.js:80
                                                            n.$6 @ O4aTHuS-3U8.js:90
                                                            t.$6 @ O4aTHuS-3U8.js:90
                                                            n.inform @ O4aTHuS-3U8.js:90
                                                            t.inform @ O4aTHuS-3U8.js:90
                                                            (anonymous) @ O4aTHuS-3U8.js:336
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            p @ O4aTHuS-3U8.js:342
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            await in e.getTransport_DEPRECATED
                                                            n.establishStream @ mhdg36vZfaR.js:115
                                                            o.establishStream @ mhdg36vZfaR.js:130
                                                            n.$26 @ mhdg36vZfaR.js:128
                                                            n.start @ mhdg36vZfaR.js:128
                                                            n.requestStream @ bv18pDUd4of.js:106
                                                            O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            _ @ O4aTHuS-3U8.js:336
                                                            f @ O4aTHuS-3U8.js:336
                                                            t @ bv18pDUd4of.js:96
                                                            (anonymous) @ bv18pDUd4of.js:96
                                                            W @ O4aTHuS-3U8.js:64
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            F @ O4aTHuS-3U8.js:64
                                                            n.qplMarkerStart @ mhdg36vZfaR.js:101
                                                            e @ mhdg36vZfaR.js:114
                                                            e.$26 @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:114
                                                            u @ mhdg36vZfaR.js:105
                                                            s @ mhdg36vZfaR.js:105
                                                            e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                            await in e.getTransport_DEPRECATED
                                                            n.establishStream @ mhdg36vZfaR.js:115
                                                            o.establishStream @ mhdg36vZfaR.js:130
                                                            n.$26 @ mhdg36vZfaR.js:128
                                                            n.start @ mhdg36vZfaR.js:128
                                                            n.requestStream @ bv18pDUd4of.js:106
                                                            3lEmVHWqBit.js:29 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                            e @ 3lEmVHWqBit.js:29
                                                            setUnloadHook @ 3lEmVHWqBit.js:116
                                                            s._initialize @ 3lEmVHWqBit.js:118
                                                            (anonymous) @ 3lEmVHWqBit.js:118
                                                            W @ O4aTHuS-3U8.js:64
                                                            M @ O4aTHuS-3U8.js:64
                                                            F @ O4aTHuS-3U8.js:64
                                                            y @ 3lEmVHWqBit.js:125
                                                            m @ ggUmxTZcUv5.js:24
                                                            p @ ggUmxTZcUv5.js:24
                                                            (anonymous) @ ggUmxTZcUv5.js:42
                                                            e @ O4aTHuS-3U8.js:342
                                                            p @ O4aTHuS-3U8.js:342
                                                            d @ O4aTHuS-3U8.js:334
                                                            (anonymous) @ O4aTHuS-3U8.js:334
                                                            applyWithGuard @ O4aTHuS-3U8.js:78
                                                            p @ O4aTHuS-3U8.js:342
                                                            o.<computed> @ O4aTHuS-3U8.js:197
                                                                g @ O4aTHuS-3U8.js:197
                                                                e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                                O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                                _ @ O4aTHuS-3U8.js:336
                                                                f @ O4aTHuS-3U8.js:336
                                                                e @ mhdg36vZfaR.js:114
                                                                e.$26 @ mhdg36vZfaR.js:114
                                                                u @ mhdg36vZfaR.js:114
                                                                u @ mhdg36vZfaR.js:105
                                                                s @ mhdg36vZfaR.js:105
                                                                e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                                await in e.getTransport_DEPRECATED
                                                                n.establishStream @ mhdg36vZfaR.js:115
                                                                o.establishStream @ mhdg36vZfaR.js:130
                                                                n.$26 @ mhdg36vZfaR.js:128
                                                                n.start @ mhdg36vZfaR.js:128
                                                                n.requestStream @ bv18pDUd4of.js:106
                                                                await in n.requestStream
                                                                (anonymous) @ ICWzmN7u0cG.js:14
                                                                (anonymous) @ O4aTHuS-3U8.js:116
                                                                e @ O4aTHuS-3U8.js:342
                                                                p @ O4aTHuS-3U8.js:342
                                                                d @ O4aTHuS-3U8.js:334
                                                                (anonymous) @ O4aTHuS-3U8.js:334
                                                                applyWithGuard @ O4aTHuS-3U8.js:78
                                                                p @ O4aTHuS-3U8.js:342
                                                                o.<computed> @ O4aTHuS-3U8.js:197
                                                                    g @ O4aTHuS-3U8.js:197
                                                                    e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                                    O4aTHuS-3U8.js:336 [Violation] Permissions policy violation: unload is not allowed in this document.
                                                                    _ @ O4aTHuS-3U8.js:336
                                                                    f @ O4aTHuS-3U8.js:336
                                                                    t @ bv18pDUd4of.js:96
                                                                    (anonymous) @ bv18pDUd4of.js:96
                                                                    W @ O4aTHuS-3U8.js:64
                                                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                                                    W @ O4aTHuS-3U8.js:64
                                                                    M @ O4aTHuS-3U8.js:64
                                                                    F @ O4aTHuS-3U8.js:64
                                                                    n.qplMarkerStart @ mhdg36vZfaR.js:101
                                                                    e @ mhdg36vZfaR.js:114
                                                                    e.$26 @ mhdg36vZfaR.js:114
                                                                    u @ mhdg36vZfaR.js:114
                                                                    u @ mhdg36vZfaR.js:105
                                                                    s @ mhdg36vZfaR.js:105
                                                                    e.getTransport_DEPRECATED @ mhdg36vZfaR.js:114
                                                                    await in e.getTransport_DEPRECATED
                                                                    n.establishStream @ mhdg36vZfaR.js:115
                                                                    o.establishStream @ mhdg36vZfaR.js:130
                                                                    n.$26 @ mhdg36vZfaR.js:128
                                                                    n.start @ mhdg36vZfaR.js:128
                                                                    n.requestStream @ bv18pDUd4of.js:106
                                                                    await in n.requestStream
                                                                    (anonymous) @ ICWzmN7u0cG.js:14
                                                                    (anonymous) @ O4aTHuS-3U8.js:116
                                                                    e @ O4aTHuS-3U8.js:342
                                                                    p @ O4aTHuS-3U8.js:342
                                                                    d @ O4aTHuS-3U8.js:334
                                                                    (anonymous) @ O4aTHuS-3U8.js:334
                                                                    applyWithGuard @ O4aTHuS-3U8.js:78
                                                                    p @ O4aTHuS-3U8.js:342
                                                                    o.<computed> @ O4aTHuS-3U8.js:197
                                                                        g @ O4aTHuS-3U8.js:197
                                                                        e.port1.onmessage @ O4aTHuS-3U8.js:197
                                                                        <Link
                                                                            href={profileHref}
                                                                            style={{
                                                                                display: 'inline-block',
                                                                                fontSize: '10px',
                                                                                fontWeight: 700,
                                                                                letterSpacing: '0.18em',
                                                                                textTransform: 'uppercase',
                                                                                color: '#c5a059',
                                                                                borderBottom: '2px solid rgba(197,160,89,0.25)',
                                                                                paddingBottom: '3px',
                                                                                textDecoration: 'none',
                                                                            }}
                                                                        >
                                                                            View Full Profile
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                )
}
