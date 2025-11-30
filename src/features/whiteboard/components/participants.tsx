const Participants = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 flex items-center">
      List users
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 w-[100px] flex items-center" />
  );
};

export default Participants;
