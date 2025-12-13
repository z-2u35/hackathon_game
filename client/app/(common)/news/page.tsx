import NewsHero from "@/components/pages/news/NewsHero";
import NewsFilterBar from "@/components/pages/news/NewsFilterBar";
import NewsList from "@/components/pages/news/NewsList";
import NewsFooter from "@/components/pages/news/NewsFooter";

export default function NewsPage() {
  return (
    <main className="min-h-screen font-pixel p-3 bg-zinc-950 text-white">
      <NewsHero />
      <NewsFilterBar />
      <NewsList />
      <NewsFooter />
    </main>
  );
}
