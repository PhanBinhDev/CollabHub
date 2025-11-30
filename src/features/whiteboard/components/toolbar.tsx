const Toolbar = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 shadow-md rounded-md">
      <div className="bg-white rounded-md p-1.5 gap-y-1 flex flex-col items-center shadow-md">
        <div>Pen</div>
        <div>Square</div>
        <div>Circle</div>
      </div>
      <div className="bg-white rounded-md flex flex-col items-center shadow-md p-1.5">
        <div>Undo</div>
        <div>Redo</div>
      </div>
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
  );
};

export default Toolbar;
