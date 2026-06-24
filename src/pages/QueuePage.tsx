import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/shared/ui/card";
import { Ellipsis, X } from "lucide-react";
const tabs = ["Все", "В очереди", "Идет", "Готово", "Ошибка"];

const QueuePage = () => {
    const [activeTab, setActiveTab] = useState("Все");
    return(
        <div className="flex flex-col h-full px-[160px] py-[40px]">
            {/* Header */}
            <div className="w-full flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold mb-0.5">Очередь генераций</h3>
                    <h4 className="text-muted-foreground text-sm max-w-xl">Ваши задачи в реальном времени</h4>
                </div>
                <Button variant="ghost" size="sm">Очистить готовые</Button>
            </div>
            {/* Status */}
            <div className="mt-[24px] grid grid-cols-4 gap-2">
                <div className="px-[18px] py-[16px] flex flex-col border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-1 group bg-card">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--c-fg-mute)" }}/>
                        <p className="text-[13px]" style={{ color: "var(--c-fg-mute)" }}>В очереди</p>
                    </div>
                    <h3 className="text-xl font-semibold">3</h3>
                </div>
                <div className="px-[18px] py-[16px] flex flex-col border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-1 group bg-card">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"/>
                        <p className="text-[13px]" style={{ color: "var(--c-accent-fg)" }}>Идет</p>
                    </div>
                    <h3 className="text-xl font-semibold">3</h3>
                </div>
                <div className="px-[18px] py-[16px] flex flex-col border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-1 group bg-card">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"/>
                        <p className="text-[13px]" style={{ color: "var(--c-fg-mute)" }}>Готово</p>
                    </div>
                    <h3 className="text-xl font-semibold">3</h3>
                </div>
                <div className="px-[18px] py-[16px] flex flex-col border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-1 group bg-card">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]"/>
                        <p className="text-[13px]" style={{ color: "var(--c-fg-mute)" }}>Ошибка</p>
                    </div>
                    <h3 className="text-xl font-semibold">3</h3>
                </div>
            </div>
            {/* Tabs */}
            <div className="mt-[24px] flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {tabs.map((t) => (
                <Button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    variant="ghost" size="sm"
                    style={{
                        color: t === activeTab ? "var(--c-fg)" : "var(--c-fg-dim)"
                    }}
                    className={cn(
                        "px-4 py-2 rounded-full whitespace-nowrap transition-colors",
                        t === activeTab ? "gradient-accent text-white" : "border border-border hover:bg-accent/50"
                    )}                >
                    {t}
                </Button>
                ))}
                {/* sort */}
                <Button
                    variant="ghost" size="sm"
                    style={{color: "var(--c-fg-dim)"}}
                    className={cn("ml-[34px] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",)}>
                    Сначала новые v
                </Button>
            </div>
            {/* Tasks */}
            <div className="mt-[24px]">
                <motion.div
                    initial="hidden" animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    className="border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-3 group bg-card"
                >
                    <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[hsl(var(--primary))/0.18]" style={{ background: "rgba(232, 84, 32, 0.1)", border: "1px solid rgba(232, 84, 32, 0.2)" }}>
                        {/* <a.Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} strokeWidth={1.75} /> */}
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-[14px] font-medium group-hover:text-primary transition-colors">
                            Неоновый киберпанк-город под дождём, вид сверху
                        </h3>

                        {/* Метаданные */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                                style={{ boxShadow: "0 0 8px var(--c-accent)" }}
                            />
                            <span>Kling 3.0</span>
                            <span>•</span>
                            <span>≈ 2 мин</span>
                            <span>·</span>
                            <span>150 cr</span>
                        </div>

                        {/* Прогресс и статус */}
                        <div className="space-y-0.5 pt-0.5">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: '28%' }} />
                            </div>
                            </div>
                        </div>
                    </div>
                    {/* Действия */}
                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xs font-medium tabular-nums">28%</span>
                        <div className="text-xs text-muted-foreground px-[10px] rounded-[8px] py-[5px]"style={{background: "var(--c-accent-soft)", color: "var(--c-accent-2)"}}>Идёт</div>
                        <Card className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px]">
                        <X color="var(--c-fg-mute)" size={14}/>
                        </Card>           
                        <Card className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px]">
                        <Ellipsis color="var(--c-fg-mute)" size={14}/>
                        </Card>           
                    </div>
                </motion.div>
            </div>

        </div>
    )
}

export default QueuePage;