"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard, VideoRowCardSkeleton } from "../components/video-row-card";
import { videoRelations } from "@/db/schema";
import { VideoGridCard, VideoGridCardSkeleton } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { isMainThread } from "worker_threads";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";


interface SuggestionsSectionProps{
    videoId : string;
    isManual?: boolean;
};

export const SuggestionSection = ({
    videoId , isManual
}: SuggestionsSectionProps) => {
    return(
        <Suspense fallback={<SuggestionSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <SuggestionSectionSuspense videoId = {videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    );
};

const SuggestionSectionSkeleton = () => {
    return (
        <>
        <div className="hidden md:block space-y-3">
            {Array.from({length: 8}).map((_,index) => (
                <VideoRowCardSkeleton key={index} size="compact" />
            ))}
        </div>
        <div className="block md:hidden space-y-10">
        {Array.from({length: 8}).map((_,index) => (
                <VideoGridCardSkeleton key={index}/>
            ))}
        </div>
        </>
    );
};

 const SuggestionSectionSuspense = ({
    videoId, isManual,
}: SuggestionsSectionProps) => {

    const [suggestions , query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT,
    },{
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
    return (
        <>
        <div className="hidden md:block space-y-3"> 
            {suggestions.pages.flatMap((page) => page.items.map((video) => (
                <VideoRowCard 
                key={videoId}
                data={video}
                size="compact"
                />
            )))}
        </div>
        <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) => page.items.map((video) => (
                <VideoGridCard
                key={videoId}
                data={video}
                />
            )))}
        </div>
        <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        />
        </>
    );
};