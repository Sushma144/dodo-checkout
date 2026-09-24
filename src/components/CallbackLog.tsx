type CallbackLogProps = {
  events: string[];
};

export function CallbackLog({
  events,
}: CallbackLogProps) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">
            Checkout events
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            SDK callbacks will appear here.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {events.length > 0
            ? `${events.length} events`
            : "Waiting"}
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-5">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">
            No checkout events yet.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map(
              (
                event,
                index,
              ) => (
                <div
                  key={`${event}-${index}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-600"
                >
                  {event}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}