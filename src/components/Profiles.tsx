import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import Modal from "./Modal";
import { useProfileContext, useProfileDispatchContext } from "./profileContext";
import { ActionType, UserProfile } from "../common/typo";
import Profile from "../pages/Profile";

export default function Profiles({ edit }: { edit: boolean }) {
  const [isProfileEditorOpen, setisProfileEditorOpen] = useState(false);
  const navigate = useNavigate();
  function MagnageProfile() {
    navigate("/ManageProfiles");
  }

  function openEditor() {
    setisProfileEditorOpen(true);
  }

  function closeEditor() {
    setisProfileEditorOpen(false);
  }

  const [profile, setprofile] = useState<UserProfile | null>(null);

  const userProfiles = useProfileContext();
  const dispatch = useProfileDispatchContext() as React.Dispatch<ActionType>;

  function selectProfile(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    navigate("/browse");
  }

  function onEditProfile(profile: UserProfile) {
    setprofile(profile);
    openEditor();
  }

  function onAddProfile() {
    const newProfile: UserProfile = {
      id: "",
      name: "",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    };
    setprofile(newProfile);
    openEditor();
  }

  function onSaveProfile(profile: UserProfile) {
    const action: ActionType = {
      type: profile.id ? "edit" : "add",
      payload: profile,
    };

    dispatch(action);
  }

  function onDeleteProfile(profile: UserProfile) {
    dispatch({ type: "delete", payload: profile });
    setisProfileEditorOpen(false);
  }

  const heading = !edit ? "Who's watching" : "Manage Profiles";
  return (
    <>
      <h1 className="mb-8 text-6xl">{heading}</h1>
      <section className="mb-8 flex gap-4">
        {userProfiles?.profiles?.map((profile) => {
          return (
            <ProfileCard
              key={profile.id}
              profile={profile}
              edit={edit}
              onEditClick={onEditProfile}
              onProfileClick={selectProfile}
            />
          );
        })}
        <AddProfile onAddProfile={onAddProfile} />
      </section>
      {profile ? (
        <EditProfile
          edit={edit}
          isOpen={isProfileEditorOpen}
          title=""
          onClose={closeEditor}
          profile={profile}
          onSave={onSaveProfile}
          onDelete={() => onDeleteProfile(profile)}
        />
      ) : null}
      {edit ? (
        <>
          <ProfileButton onClick={() => navigate("/")}>Done</ProfileButton>
        </>
      ) : (
        <ProfileButton
          onClick={MagnageProfile}
          className="mt-8"
          buttonType="secondary"
        >
          Manage Profile
        </ProfileButton>
      )}
    </>
  );
}

function ProfileButton({
  buttonType = "primary",
  ...props
}: {
  buttonType?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${
        buttonType == "primary"
          ? "bg-gray-100 text-dark hover:bg-netflixRed hover:text-white "
          : "border border-white text-gray-400 hover:text-white"
      }py-2 px-4 text-xl ${props.className}`}
    >
      {props.children}
    </button>
  );
}

function ProfileCard({
  edit,
  onEditClick,
  profile,
  onProfileClick,
}: {
  edit: boolean;
  onEditClick: (pofile: UserProfile) => void;
  profile: UserProfile;
  onProfileClick: (profile: UserProfile) => void;
}) {
  const { id, imageUrl, name } = profile;

  function editClick(event: React.SyntheticEvent) {
    event.stopPropagation();
    onEditClick(profile);
  }

  return (
    <section
      onClick={() => onProfileClick(profile)}
      id={id}
      className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400 hover:text-white"
    >
      <section className=" relative h-[10vh] max-h-[200px] min-h-[84px]  w-[10vw] min-w-[84px] max-w-[200px] overflow-hidden rounded-md hover:h-[10vw] hover:border-4 hover:border-gray-100">
        <img src={imageUrl} alt={name} />
        {edit ? (
          <button
            onClick={editClick}
            className="absolute inset-0  grid place-items-center bg-black/50 "
          >
            <PencilIcon className="w-[25%] text-white" />
          </button>
        ) : null}
      </section>
      <h1 className="text-xl">{name}</h1>
    </section>
  );
}

function AddProfile({ onAddProfile }: { onAddProfile: () => void }) {
  return (
    <section className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400">
      <button
        onClick={onAddProfile}
        className="grid h-[10vh] max-h-[200px] min-h-[84px] w-[10vw]  min-w-[84px] max-w-[200px] place-items-center overflow-hidden rounded-md hover:h-[10vw] hover:border-4 hover:border-gray-100 hover:bg-gray-400 hover:text-white"
      >
        <PlusCircleIcon className="w-[75%] " />
      </button>
    </section>
  );
}

function EditProfile(props: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  title: string;
  edit?: boolean;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
}) {
  const heading = props.profile.id ? "Edit Profile " : "Add Profile";

  function cancelEdit() {
    props.onClose(false);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { profileName, imageUrl } = event.target as typeof event.target & {
      profileName: HTMLInputElement;
      imageUrl: HTMLInputElement;
    };

    if (props.onSave) {
      let profileupdated: UserProfile = {
        name: profileName.value,
        id: props.profile.id,
        imageUrl: imageUrl.value,
      };
      props.onSave(profileupdated);
    }

    props.onClose(true);
  }

  return (
    <Modal {...props} className="">
      <section className="h-screen">
        <form onSubmit={onSubmit} className="my-16 max-w-4xl ">
          <h1 className="mb-4 text-6xl">{heading}</h1>
          <section className="grid grid-cols-[200px_auto] gap-4 border-t border-b p-4 text-gray-100">
            <section className="aspect-square overflow-hidden rounded-md">
              <img src={props.profile.imageUrl} alt="" />
            </section>
            <section className="flex flex-col gap-2">
              <input
                id="profileName"
                defaultValue={props.profile.name}
                placeholder="Enter Name for the profile"
                type="text"
                className="w-full bg-zinc-500 p-2 outline-none"
              />
              <input
                id="imageUrl"
                defaultValue={props.profile.imageUrl}
                placeholder="Enter Url for image"
                type="text"
                className=" w-full bg-zinc-500 p-2 outline-none"
              />
            </section>
          </section>
          <section className="mt-8 flex gap-4 ">
            <ProfileButton type="submit">Save</ProfileButton>
            {props.profile.id ? (
              <ProfileButton onClick={()=>props.onDelete(props.profile)} type="button">
                Delete
              </ProfileButton>
            ) : null}
            <ProfileButton
              type="button"
              buttonType="secondary"
              onClick={cancelEdit}
            >
              cancel
            </ProfileButton>
          </section>
        </form>
      </section>
    </Modal>
  );
}
