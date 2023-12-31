import Image from "next/image";

interface Props {
  accountId: string;
  name: string;
  username: string;
  imgUrl: string;
  authUserId: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  name,
  username,
  authUserId,
  imgUrl,
  bio,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover border-red-800">
            <Image
              src={imgUrl}
              alt="Profile image"
              // fill
              width={90}
              height={90}
              className="rounded-full  object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1 ">
            <h2 className="text-light-1 text-left text-heading3-bold">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      {/* TODO : community */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
