"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { ChevronDown, ChevronRight, FileIcon, Folder } from "lucide-react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Item } from "./item";
import Options from "@/app/(notes)/_components/options";
import Notes from "@/app/(notes)/_components/notes";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const folders = useQuery(api.folder.getAllFolders,{});

  // const documents = useQuery(api.documents.getSidebar, {
  //   parentDocument: parentDocumentId
  // });

  if (folders === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

      <div className="text-muted-foreground">
        {
        folders.map((folder) => (
            <FolderItem key={folder._id} folderId={folder._id} foldertitle={folder.title}/>
        ))
        }
      </div>
    </>
  );


};
const FolderItem = ({folderId, foldertitle}:{folderId:Id<"folder">, foldertitle:string}) => {
    const [shownotes, setShownotes] = useState<boolean>(false)
    const [showOption, setShowOption] = useState<boolean>(false)
    const notes = useQuery(api.note.getNotesById,{
        folderId
    });
  const params = useParams();
  const router = useRouter();
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

    if(notes == undefined)
        return (
            <Skeleton className='w-4 h-4'/>
        )
    return(
        <div>
            <div onMouseEnter={() => setShowOption(true)} onMouseLeave={() => setShowOption(false)} className='flex items-center justify-between py-[1px] hover:bg-primary/5 px-3 cursor-pointer'>   
                <div onClick={() => {setShownotes(!shownotes); router.push(`/folder/${folderId}`)}}  className='flex items-center space-x-1'>
                    <ChevronComp folderId={folderId} isCollapsed={shownotes}/>
                    <Folder size={18} />
                    <span>{foldertitle}</span>
                </div>
                <div>
                    <Options showOption={showOption} folder={false} folderId={folderId} deleteOptions={true}/>
                </div>
            </div>
            {shownotes && (
            <div className='pl-5'>
                  {notes?.map((note) => (
                    <div key={note._id}>
                      <Item
                        id={note._id}
                        folderId={note.folderId}
                        onClick={() => onRedirect(note._id)}
                        label={note.title}
                        icon={FileIcon}
                        documentIcon={note.icon}
                        active={params.documentId === note._id}
                      />
                      {/* {expanded[document._id] && (
                        <DocumentList
                          parentDocumentId={document._id}
                          level={level + 1}
                        />
                      )} */}
                    </div>
                  ))}
            </div>
            )}
        </div>
    )
}

  const ChevronComp = ({folderId, isCollapsed}:{folderId:string, isCollapsed: boolean}) => {
    const notes = useQuery(api.note.getNotesById,{
        folderId
    });

    console.log(notes)

    if( notes && notes?.length <= 0){
        return(
            <span className=''></span>
        )
    }

      return(
        <>
          {!isCollapsed 
            ? <ChevronRight size={18}/>
            : <ChevronDown size={18} />
          }
        </>
      )
}